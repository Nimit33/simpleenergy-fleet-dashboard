import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";

export function Home() {
  const [vehicles, setVehicles] = useState([]);

  // Fetch vehicles data from localStorage or vehicle management page
  useEffect(() => {
    const storedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    setVehicles(storedVehicles);
  }, []);

  // Calculate fleet metrics
  const fleetMetrics = {
    inTransit: vehicles.filter(v => v.status === "In Transit").length,
    charging: vehicles.filter(v => v.status === "Charging").length,
    idle: vehicles.filter(v => v.status === "Idle").length,
    avgBattery: vehicles.reduce((acc, v) => acc + v.battery, 0) / vehicles.length || 0,
    lowBatteryCount: vehicles.filter(v => v.battery < 20).length,
    chargingTimeEstimate: vehicles
      .filter(v => v.status === "Charging")
      .reduce((acc, v) => acc + (100 - v.battery) * 2, 0) // Assuming 2 minutes to full charge per battery %
  };

  return (
    <div className="mt-12">
      <Typography variant="h5" color="blue-gray" className="mb-6">
        Fleet Overview Dashboard
      </Typography>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Displaying Key Metrics */}
        <Card className="p-4 border border-blue-gray-100 shadow-sm">
          <Typography variant="h6" color="blue-gray">In Transit Vehicles</Typography>
          <Typography>{fleetMetrics.inTransit}</Typography>
        </Card>
        <Card className="p-4 border border-blue-gray-100 shadow-sm">
          <Typography variant="h6" color="blue-gray">Charging Vehicles</Typography>
          <Typography>{fleetMetrics.charging}</Typography>
        </Card>
        <Card className="p-4 border border-blue-gray-100 shadow-sm">
          <Typography variant="h6" color="blue-gray">Idle Vehicles</Typography>
          <Typography>{fleetMetrics.idle}</Typography>
        </Card>
        <Card className="p-4 border border-blue-gray-100 shadow-sm">
          <Typography variant="h6" color="blue-gray">Average Battery Level</Typography>
          <Typography>{fleetMetrics.avgBattery.toFixed(2)}%</Typography>
        </Card>
        <Card className="p-4 border border-blue-gray-100 shadow-sm">
          <Typography variant="h6" color="blue-gray">Vehicles Below 20% Battery</Typography>
          <Typography>{fleetMetrics.lowBatteryCount}</Typography>
        </Card>
        <Card className="p-4 border border-blue-gray-100 shadow-sm">
          <Typography variant="h6" color="blue-gray">Estimated Full Charge Time</Typography>
          <Typography>{fleetMetrics.chargingTimeEstimate.toFixed(2)} minutes</Typography>
        </Card>
      </div>

    </div>
  );
}

export default Home;
