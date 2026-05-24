import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class IncidentService implements OnModuleInit, OnModuleDestroy {
    private readonly pool;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    report(input: {
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
    updateStatus(id: string, status: string): Promise<{
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
    private resolveStatus;
    private resolveSeverity;
    private toIncident;
}
