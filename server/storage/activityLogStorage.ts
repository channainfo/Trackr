import { db } from "../db";
import { activityLogsTable } from "@shared/schema";
import { ActivityLog } from "@shared/schema";
import { desc } from "drizzle-orm";

export class ActivityLogStorage {
  async getActivityLogs(): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogsTable)
      .orderBy(desc(activityLogsTable.timestamp));
  }
}
