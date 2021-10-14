### Screeps

My personal AI that I'm developing for the Screeps: World game.

---

**Notes**

- Couriers should act as transport belts
- Couriers should evenly distribute energy between containers. When idle, they should find the closest highest filled, and the closest lowest filled, making them even.

**TODO**

- [ ] Build containers next to sources
- [x] Have couriers run materials from containers to spawn
- [x] Use Grunt to allow me to make folders and better organize code
- [x] Only allow max amount of creeps to go to source based on available spots
- [x] Creeps should have their own part templates
- [ ] Haul relative to spawn, not creep
- ~~[ ] Have idle creeps move to a flag~~
- [x] Implement a priority queue for building types (extensions -> containers -> roads)
- [ ] Implement a road building & repair queue
- [ ] Automatically place road building orders on frequently traveled paths (possibly by couriers only while not on expeditions)
- [ ] Implement scout class
- [ ] Rewrite the parts system of spawning, should allow for every x part put an additional y part
- [x] Couriers should go to upgraders
- [ ] If spawn is full, deposit to directly adjacent container
- [ ] Implement IMPORT, EXPORT, and STORAGE containers, with creeps automatically moving based on a queue
- [ ] Implement a builder area and an upgrader area
- [ ] Implement rooms for the various roles
- [ ] Automatically determine wether a chest is import or export using heuristics
- [ ] Generate a map of where energy is needed the most
- [ ] Automatically run scripts based on level of the room
- [ ] Have creep roles spawn in a round-robin style system

**Known Issues**

- [x] Multiple creeps will go towards the same source, despite only one mining spot being available
- [x] Creeps will still leave the deposit structure even if they only partially cleared their inventory
- [ ] Couriers will flip flop between a container that is slowly refilling (empty -> 50) and one that is full because it's being pulled by the slowly refilling one. This can be solved by adding a max amount of couriers that can go to a container based on the amount of energy inside it.
