import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2, Search, Filter, RefreshCcw, Download, Calendar, UserCog, Lock, AlertTriangle, Database } from "lucide-react";

export default function AdminLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Query for activity logs
  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["/api/admin/logs"],
  });

  // Filtered logs based on search query and filters
  const filteredLogs = activityLogs
    ? activityLogs.filter((log: any) => {
        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          // Check if log contains the search query in any field
          const matchesSearch = 
            log.action.toLowerCase().includes(query) ||
            (log.details && JSON.stringify(log.details).toLowerCase().includes(query)) ||
            (log.ipAddress && log.ipAddress.toLowerCase().includes(query)) ||
            (log.userAgent && log.userAgent.toLowerCase().includes(query));
          
          if (!matchesSearch) return false;
        }
        
        // Apply type filter
        if (typeFilter !== "all") {
          // Determine log type based on action
          const logType = getLogType(log.action);
          if (logType !== typeFilter) {
            return false;
          }
        }
        
        // Apply time filter
        if (timeFilter !== "all") {
          const logDate = new Date(log.timestamp);
          const now = new Date();
          
          if (timeFilter === "today") {
            const today = new Date(now);
            today.setHours(0, 0, 0, 0);
            if (logDate < today) return false;
          } else if (timeFilter === "week") {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (logDate < weekAgo) return false;
          } else if (timeFilter === "month") {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (logDate < monthAgo) return false;
          }
        }
        
        return true;
      })
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  // Determine log type based on action
  function getLogType(action: string) {
    if (action.includes("user_") || action.includes("profile_")) {
      return "user";
    } else if (action.includes("admin_") || action === "system_setting_updated") {
      return "admin";
    } else if (action.includes("login") || action.includes("logout") || action.includes("auth_")) {
      return "auth";
    } else {
      return "system";
    }
  }

  // Get icon for log type
  function getLogIcon(action: string) {
    const type = getLogType(action);
    
    switch (type) {
      case "user":
        return <UserCog className="h-4 w-4" />;
      case "admin":
        return <Database className="h-4 w-4" />;
      case "auth":
        return <Lock className="h-4 w-4" />;
      case "system":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  }

  // Format date for display
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  // Format log type for display
  function formatLogType(action: string) {
    const type = getLogType(action);
    
    return {
      label: type.charAt(0).toUpperCase() + type.slice(1) + " Event",
      class: type === "user" 
        ? "bg-green-500/10 text-green-500" 
        : type === "admin" 
        ? "bg-purple-500/10 text-purple-500" 
        : type === "auth" 
        ? "bg-blue-500/10 text-blue-500" 
        : "bg-yellow-500/10 text-yellow-500"
    };
  }

  // Handle exporting logs
  const handleExportLogs = () => {
    // This would export logs to CSV
    alert("Export feature would be implemented here");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="user">User Events</SelectItem>
                  <SelectItem value="admin">Admin Events</SelectItem>
                  <SelectItem value="auth">Auth Events</SelectItem>
                  <SelectItem value="system">System Events</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleExportLogs}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Log Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No logs found</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log: any, index: number) => {
                      const logType = formatLogType(log.action);
                      return (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(log.timestamp)}
                          </TableCell>
                          <TableCell>
                            {log.userId || "System"}
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${logType.class}`}>
                              {getLogIcon(log.action)}
                              <span className="ml-1">{logType.label}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.action.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.ipAddress || "N/A"}
                          </TableCell>
                          <TableCell>
                            {log.details ? (
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                View Details
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">No details</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNum = i + 1;
                        
                        // Adjust page numbers for pagination display
                        if (totalPages > 5) {
                          if (currentPage > 3 && currentPage < totalPages - 1) {
                            pageNum = currentPage - 2 + i;
                          } else if (currentPage >= totalPages - 1) {
                            pageNum = totalPages - 4 + i;
                          }
                        }
                        
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
