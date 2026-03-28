export type MachineStatus = "running" | "idle" | "emergency_stop" | "maintenance";

export interface TelemetryPayload {
    machineId: string;
    timestamp: number;
    sensors: {
        temperature: number;
        pressure: number;
        vibration: number;
    };
    status: MachineStatus;
}