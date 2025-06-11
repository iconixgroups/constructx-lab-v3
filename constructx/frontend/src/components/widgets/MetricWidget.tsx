import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

const MetricWidget = ({ data, config }) => {
    if (!data) return null;

    const { value, trend } = data;

    return (
        <Card className="border-none shadow-none bg-transparent h-full flex items-center justify-center">
            <CardContent className="p-2 text-center">
                <div className="text-4xl font-bold">{value ?? "N/A"}</div>
                {trend && (
                    <div className={`flex items-center justify-center text-xs ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {/* Add logic for trend description if available */}
                    </div>
                )}
                {/* Add label/unit from config if available */}
                {config?.label && <div className="text-xs text-muted-foreground mt-1">{config.label}</div>}
            </CardContent>
        </Card>
    );
};

export default MetricWidget;

