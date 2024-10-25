import React from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Notifications() {
  const [lowBatteryAlerts, setLowBatteryAlerts] = React.useState([]);

  React.useEffect(() => {
    const checkLowBattery = () => {
      const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
      const alerts = vehicles.filter(vehicle => vehicle.battery < 15);
      setLowBatteryAlerts(alerts);
    };

    // Check for low battery vehicles initially
    checkLowBattery();

    // Optionally, set an interval to check periodically (e.g., every 5 seconds)
    const interval = setInterval(checkLowBattery, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Alerts
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {lowBatteryAlerts.length > 0 ? (
            lowBatteryAlerts.map(vehicle => (
              <Alert
                key={vehicle.id}
                open={true}
                color="orange"
                icon={<InformationCircleIcon className="h-6 w-6" />}
              >
                Battery low on Vehicle ID: {vehicle.id} - {vehicle.battery.toFixed(2)}%
              </Alert>
            ))
          ) : (
            <Typography variant="h6" color="green">
              All vehicles have sufficient battery.
            </Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;
