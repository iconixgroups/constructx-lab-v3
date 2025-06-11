import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const ListWidget = ({ data, config }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div className="p-4 text-center text-sm text-muted-foreground">No items to display.</div>;
    }

    // Determine fields to display based on config or data structure
    // Example: Assuming data items have `id`, `title`, and optionally `date` or `status`

    return (
        <ScrollArea className="h-full w-full p-2">
            <div className="space-y-2">
                {data.map((item, index) => (
                    <React.Fragment key={item.id || index}>
                        <div className="text-xs p-1 hover:bg-muted rounded">
                            <div className="font-medium truncate" title={item.title}>{item.title || "Untitled Item"}</div>
                            {item.date && <div className="text-muted-foreground text-[10px]">{new Date(item.date).toLocaleDateString()}</div>}
                            {item.status && <div className="text-muted-foreground text-[10px]">Status: {item.status}</div>}
                            {/* Add more fields as needed based on data source */}
                        </div>
                        {index < data.length - 1 && <Separator className="my-1" />}
                    </React.Fragment>
                ))}
            </div>
        </ScrollArea>
    );
};

export default ListWidget;

