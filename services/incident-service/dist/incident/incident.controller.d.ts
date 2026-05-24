import { IncidentService } from './incident.service';
export declare class IncidentController {
    private readonly incidentService;
    constructor(incidentService: IncidentService);
    report(body: {
        title: string;
        description?: string;
        zone?: string;
        severity?: string;
        reportedBy?: string;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        zone: string;
        status: "REPORTED" | "IN_PROGRESS" | "RESOLVED";
        severity: "LOW" | "MEDIUM" | "HIGH";
        reportedBy: string;
        createdAt: string;
        updatedAt: string;
    }>;
    list(status?: string): Promise<any>;
    detail(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        zone: string;
        status: "REPORTED" | "IN_PROGRESS" | "RESOLVED";
        severity: "LOW" | "MEDIUM" | "HIGH";
        reportedBy: string;
        createdAt: string;
        updatedAt: string;
    }>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        zone: string;
        status: "REPORTED" | "IN_PROGRESS" | "RESOLVED";
        severity: "LOW" | "MEDIUM" | "HIGH";
        reportedBy: string;
        createdAt: string;
        updatedAt: string;
    }>;
}
