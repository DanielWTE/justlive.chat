import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WebsiteListSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-6 w-[200px]" />
                </div>
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </div>
            <Skeleton className="h-[1px] w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 