# SPiceZ Stancer
- FiveM Stancer - Vehicle Adjustable Wheel Offsets, Rotation and Suspension Height

# Features
- Standalone Operation (No QBCORE/ESX required)
- Integrated with SPiceZ Core
- Adjustable Wheel Offsets and Rotation
- Adjustable Vehicle Suspension Height
- Fully Server Sync (State Bags)
- Optimized Performance
- Persistent Data (Database storage by Plate)
- Premium NUI Interface

# Installation
1. Move `spz-stance` to your resource folder.
2. Import `stancer.sql` to your database.
3. Ensure `spz-stance` in your `server.cfg`.

# Usage
- Use `/stancer` or press `F5` to open the menu. (If no kit is installed, it will install one automatically).
- Alternatively, use `/installstancer` to install the kit without opening the menu.

# Dependencies
- `oxmysql`
- `spz-lib` (for notifications)

# Exports for advanced usage

- Server Exports

- Add Stancer Kit to Current Vehicle
```
	exports['spz-stance']:AddStancerKit()
```

- Client Exports 
(to use this, AddStancerKit() exports must be used first 
or the vehicle must have a installed stancer kit)

- Set Wheel Offset Front
```
	exports['spz-stance']:SetWheelOffsetFront(vehicle,value)
```
- Set Wheel Offset Rear
```
	exports['spz-stance']:SetWheelOffsetRear(vehicle,value)
```
- Set Wheel Rotation Front
```
	exports['spz-stance']:SetWheelRotationFront(vehicle,value)
```
- Set Wheel Rotation Rear
```
	exports['spz-stance']:SetWheelRotationRear(vehicle,value)
```
- Open Stancer Menu
```
	exports['spz-stance']:OpenStancer()
```
# FAQ
- is the stance or wheel setting is saved even if i restart the server?
```
	yes data is save to database and attached to vehicle plate as a unique identifier
```

- when the data is being saved to Database?
```
When you delete the vehicle or store in garage
```
