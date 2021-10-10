### Screeps

My personal AI that I'm developing for the Screeps: World game.

---

**Notes**

- Couriers should act as transport belts

**TODO**

- [ ] Build containers next to sources
- [x] Have couriers run materials from containers to spawn
- [ ] Use Grunt to allow me to make folders and better organize code
- [ ] Only allow max amount of creeps to go to source based on available spots
- [x] Creeps should have their own part templates
- [ ] Haul relative to spawn, not creep
- [ ] Have idle creeps move to a flag
- [ ] Implement a priority queue for building types (extensions -> containers -> roads)
- [ ] Implement a road building & repair queue
- [ ] Automatically place road building orders on frequently traveled paths (possibly by couriers only while not on expeditions)
- [ ] Implement scout class
- [ ] Rewrite the parts system of spawning, should allow for every x part put an additional y part
- [ ] Couriers should go to upgraders
- [ ] If spawn is full, deposit to directly adjacent container
- [ ] Implement IMPORT, EXPORT, and STORAGE containers, with creeps automatically moving based on a queue
- [ ] Implement a builder area and an upgrader area
- [ ] Implement rooms for the various roles
- [ ] Automatically determine wether a chest is import or export using heuristics

**Known Issues**

- [ ] Multiple creeps will go towards the same source, despite only one mining spot being available
- [ ] Creeps will still leave the deposit structure even if they only partially cleared their inventory

https://gist.github.com/tedivm/53063e46b58ef80e9df1
