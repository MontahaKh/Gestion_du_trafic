import { TrafficService } from './traffic.service';
import { Pool } from 'pg';
import * as assert from 'assert';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';

async function runTests() {
  console.log('=== RUNNING TRAFFIC SERVICE TESTS ===');
  const service = new TrafficService();
  const directPool = new Pool({ connectionString: DATABASE_URL });

  try {
    await service.onModuleInit();
    console.log('✅ Database connected and schemas verified.');

    // 1. Test classification thresholds (using the private method)
    console.log('Testing traffic density classification thresholds...');
    const classify = (service as any).classifyDensity.bind(service);
    
    assert.strictEqual(classify(0), 'FAIBLE');
    assert.strictEqual(classify(5), 'FAIBLE');
    assert.strictEqual(classify(10), 'FAIBLE');
    
    assert.strictEqual(classify(11), 'MOYEN');
    assert.strictEqual(classify(20), 'MOYEN');
    assert.strictEqual(classify(30), 'MOYEN');
    
    assert.strictEqual(classify(31), 'ELEVE');
    assert.strictEqual(classify(100), 'ELEVE');
    console.log('✅ Density classification thresholds test passed.');

    // 2. Test Bounding Box Filtering (filtre bbox)
    console.log('Testing Bounding Box filtering logic...');
    
    // Create a temporary test vehicle
    const vehicleRes = await directPool.query(
      "INSERT INTO vehicles (vin, model, metadata, updated_at) VALUES ('TEST-BBOX', 'Bbox Test Car', '{\"status\":\"ACTIVE\"}', NOW()) RETURNING id"
    );
    const vehicleId = vehicleRes.rows[0].id;
    console.log(`Created test vehicle with ID ${vehicleId}.`);

    // Create a traffic zone: Lat [10.0, 20.0], Lng [10.0, 20.0]
    const bbox = { minLat: 10.0, minLng: 10.0, maxLat: 20.0, maxLng: 20.0 };
    const zone = await service.createZone({
      name: 'BBOX_TEST_ZONE_' + Math.random().toString(36).substring(2, 7),
      bbox
    });
    console.log(`Created test traffic zone ${zone.name} with ID ${zone.id}.`);

    // Insert a position INSIDE the bbox: Lat 15.0, Lng 15.0
    await directPool.query(
      "INSERT INTO gps_positions (vehicle_id, lat, lng, speed, recorded_at) VALUES ($1, 15.0, 15.0, 45.0, NOW())",
      [vehicleId]
    );
    console.log('Recorded one position INSIDE the bbox.');

    // Insert a position OUTSIDE the bbox: Lat 25.0, Lng 25.0 (outside lat and lng)
    await directPool.query(
      "INSERT INTO gps_positions (vehicle_id, lat, lng, speed, recorded_at) VALUES ($1, 25.0, 25.0, 45.0, NOW())",
      [vehicleId]
    );
    console.log('Recorded one position OUTSIDE the bbox.');

    // Calculate traffic density
    console.log('Calculating density for the zone...');
    const result = await service.calculate(String(zone.id), { windowMinutes: 10 });
    
    // The density should be exactly 1 (only the position inside bbox is counted!)
    assert.strictEqual(result.metric.vehicle_count, 1, 'Expected exactly 1 vehicle to be counted (inside the bbox)');
    assert.strictEqual(result.metric.level, 'FAIBLE', 'Expected classification FAIBLE for count 1');
    console.log('✅ Bounding Box filtering logic test passed successfully.');

    // Clean up
    console.log('Cleaning up test data...');
    await directPool.query('DELETE FROM gps_positions WHERE vehicle_id = $1', [vehicleId]);
    await directPool.query('DELETE FROM vehicles WHERE id = $1', [vehicleId]);
    await directPool.query('DELETE FROM traffic_metrics WHERE zone_id = $1', [zone.id]);
    await directPool.query('DELETE FROM traffic_zones WHERE id = $1', [zone.id]);
    console.log('✅ Test data cleaned up.');

    console.log('🎉 ALL TRAFFIC SERVICE TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ A TEST FAILED:', err);
    process.exit(1);
  } finally {
    await service.onModuleDestroy();
    await directPool.end();
  }
}

runTests();
