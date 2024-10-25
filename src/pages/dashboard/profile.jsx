import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";

export function Profile() {
  const initialVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [vehicleId, setVehicleId] = useState("");
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [lastChargeTime, setLastChargeTime] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("Idle");
  const [chargingSchedule, setChargingSchedule] = useState(""); // New state for charging schedule
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    console.log("Vehicles saved to local storage:", vehicles);
  }, [vehicles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) => {
        const updatedVehicles = prevVehicles.map(vehicle => {
          const currentTime = new Date();
          // Start charging if the current time matches the charging schedule
          if (vehicle.scheduledCharging && new Date(vehicle.scheduledCharging) <= currentTime && vehicle.status !== "Charging") {
            vehicle.status = "Charging";
          }

          // Update battery based on status
          if (vehicle.status === "Charging" && vehicle.battery < 100) {
            vehicle.battery = Math.min(vehicle.battery + 0.1, 100);
          } else if (vehicle.status === "In Transit" && vehicle.battery > 0) {
            vehicle.battery = Math.max(vehicle.battery - 0.05, 0);
            vehicle.distance += 0.1;
          }

          return vehicle;
        });

        return updatedVehicles;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddEditVehicle = () => {
    const newVehicle = {
      id: vehicleId,
      battery: batteryPercentage,
      distance: totalDistance,
      lastCharge: lastChargeTime,
      status: vehicleStatus,
      scheduledCharging: chargingSchedule || null, // Store charging schedule
    };

    if (editIndex !== null) {
      const updatedVehicles = [...vehicles];
      updatedVehicles[editIndex] = newVehicle;
      setVehicles(updatedVehicles);
    } else {
      setVehicles([...vehicles, newVehicle]);
    }

    resetForm();
  };

  const resetForm = () => {
    setVehicleId("");
    setBatteryPercentage(0);
    setTotalDistance(0);
    setLastChargeTime("");
    setVehicleStatus("Idle");
    setChargingSchedule(""); // Reset charging schedule
    setEditIndex(null);
    setIsOpen(false);
  };

  const handleEdit = (index) => {
    const vehicleToEdit = vehicles[index];
    setVehicleId(vehicleToEdit.id);
    setBatteryPercentage(vehicleToEdit.battery);
    setTotalDistance(vehicleToEdit.distance);
    setLastChargeTime(vehicleToEdit.lastCharge);
    setVehicleStatus(vehicleToEdit.status);
    setChargingSchedule(vehicleToEdit.scheduledCharging || ""); // Load charging schedule
    setEditIndex(index);
    setIsOpen(true);
  };

  const handleDelete = (index) => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(updatedVehicles);
  };

  const handleStatusChange = (index, status) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index].status = status;
    setVehicles(updatedVehicles);
  };

  const handleScheduleRemove = (index) => {
    setVehicles((prevVehicles) => {
      const updatedVehicles = prevVehicles.map((vehicle, idx) => {
        if (index === idx) {
          vehicle.scheduledCharging = "";
        }
        return vehicle;
      });
      return updatedVehicles;
    });
  }

  return (
    <>
      <Card className="mx-3 mt-6 border border-blue-gray-100">
        <CardBody className="p-4">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Vehicle Management
          </Typography>
          <Button onClick={() => setIsOpen(true)} color="blue">
            Add Vehicle
          </Button>
          <div className="mt-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Vehicles List
            </Typography>
            <ul>
              {vehicles.map((vehicle, index) => (
                <li key={index} className="flex justify-between mb-2">
                  <span>
                    ID: {vehicle.id} | Battery: {parseFloat(vehicle.battery).toFixed(2)}% | Distance: {parseFloat(vehicle.distance).toFixed(2)} km | Last Charge: {vehicle.lastCharge} | Status: {vehicle.status} | Scheduled Charging: {vehicle.scheduledCharging || "Not set"}
                  </span>
                  <div>
                    <Button onClick={() => handleEdit(index)} color="yellow" size="sm">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(index)} color="red" size="sm">
                      Delete
                    </Button>
                    {vehicle.status === "Charging" ? null : (
                      <Button onClick={() => handleStatusChange(index, "Charging")} color="green" size="sm">
                        Start Charging
                      </Button>
                    )}
                    {vehicle.status === "In Transit" ? null : (
                      <Button onClick={() => handleStatusChange(index, "In Transit")} color="blue" size="sm">
                        Start Transit
                      </Button>
                    )}
                    {vehicle.status === "Idle" ? null : (
                      <Button onClick={() => handleStatusChange(index, "Idle")} color="gray" size="sm">
                        Set Idle
                      </Button>
                    )}
                    <Button onClick={() => handleScheduleRemove(index)} color="gray" size="sm">
                      Remove Schedule
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>

      <Dialog open={isOpen} handler={resetForm}>
        <DialogHeader>{editIndex !== null ? "Edit Vehicle" : "Add Vehicle"}</DialogHeader>
        <DialogBody>
          <Input label="Vehicle ID" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
          <Input label="Battery Percentage" type="number" value={batteryPercentage} onChange={(e) => setBatteryPercentage(parseFloat(e.target.value))} />
          <Input label="Total Distance (km)" type="number" value={totalDistance} onChange={(e) => setTotalDistance(parseFloat(e.target.value))} />
          <Input label="Last Charge Time" type="datetime-local" value={lastChargeTime} onChange={(e) => setLastChargeTime(e.target.value)} />
          <Input label="Vehicle Status" value={vehicleStatus} onChange={(e) => setVehicleStatus(e.target.value)} />
          <Input label="Charging Schedule" type="datetime-local" value={chargingSchedule} onChange={(e) => setChargingSchedule(e.target.value)} /> {/* New input for scheduling */}
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleAddEditVehicle} color="green">
            {editIndex !== null ? "Update" : "Add"}
          </Button>
          <Button onClick={resetForm} color="red">
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Profile;
