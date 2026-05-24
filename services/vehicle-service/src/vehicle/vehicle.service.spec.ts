import { VehicleService } from './vehicle.service';
import * as assert from 'assert';

async function runTests() {
  console.log('=== RUNNING VEHICLE SERVICE TESTS ===');
  const service = new VehicleService();
  
  try {
    await service.onModuleInit();
    console.log('✅ Database connected and schema checked.');

    // 1. Test 404
    console.log('Testing 404 on non-existent vehicle...');
    try {
      await service.getVehicle('999999');
      assert.fail('Should have thrown NotFoundException');
    } catch (err: any) {
      assert.strictEqual(err.status, 404, 'Expected 404 status code');
      assert.ok(err.message.includes('not found') || err.message.includes('found'), 'Expected not found message');
      console.log('✅ 404 test passed.');
    }

    // 2. Test Insert + List
    console.log('Testing createVehicle and listVehicles...');
    const testPlate = 'TEST-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const created = await service.createVehicle({
      plateNumber: testPlate,
      model: 'Test Model',
      status: 'ACTIVE'
    });
    
    assert.strictEqual(created.plateNumber, testPlate);
    assert.strictEqual(created.model, 'Test Model');
    assert.strictEqual(created.status, 'ACTIVE');
    assert.ok(created.id, 'Expected created vehicle to have an ID');
    console.log(`✅ Created test vehicle with ID ${created.id}.`);

    const list = await service.listVehicles();
    const found = list.find(v => v.id === created.id);
    assert.ok(found, 'Expected created vehicle to be in the list');
    assert.strictEqual(found.plateNumber, testPlate);
    console.log('✅ Insert + List test passed.');

    // 3. Test Validate lat/lng
    console.log('Testing GPS position lat/lng validations...');
    // Valid GPS
    const validPos = await service.recordPosition(created.id, {
      lat: 48.8566,
      lng: 2.3522,
      speed: 50
    });
    assert.strictEqual(validPos.lat, 48.8566);
    assert.strictEqual(validPos.lng, 2.3522);
    console.log('✅ Valid GPS position recorded.');

    // Invalid lat
    try {
      await service.recordPosition(created.id, { lat: 95.0, lng: 2.3522 });
      assert.fail('Should have thrown BadRequestException for lat > 90');
    } catch (err: any) {
      assert.strictEqual(err.status, 400);
      console.log('✅ Invalid lat > 90 rejected.');
    }

    // Invalid lng
    try {
      await service.recordPosition(created.id, { lat: 48.8566, lng: -185.0 });
      assert.fail('Should have thrown BadRequestException for lng < -180');
    } catch (err: any) {
      assert.strictEqual(err.status, 400);
      console.log('✅ Invalid lng < -180 rejected.');
    }

    // Cleanup
    console.log('Cleaning up test data...');
    await (service as any).pool.query('DELETE FROM gps_positions WHERE vehicle_id = $1', [Number(created.id)]);
    await (service as any).pool.query('DELETE FROM vehicles WHERE id = $1', [Number(created.id)]);
    console.log('✅ Test data cleaned up successfully.');

    console.log('🎉 ALL VEHICLE SERVICE TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ A TEST FAILED:', err);
    process.exit(1);
  } finally {
    await service.onModuleDestroy();
  }
}

runTests();
