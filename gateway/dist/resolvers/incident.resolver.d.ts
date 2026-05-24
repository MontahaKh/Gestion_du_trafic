declare class ReportIncidentInput {
    title: string;
    description?: string;
    zone?: string;
    severity?: string;
    reportedBy?: string;
}
export declare class IncidentResolver {
    private incidentUrl;
    incidents(status?: string): Promise<any>;
    incident(id: string): Promise<any>;
    reportIncident(input: ReportIncidentInput): Promise<any>;
    updateIncidentStatus(id: string, status: string): Promise<any>;
}
export {};
