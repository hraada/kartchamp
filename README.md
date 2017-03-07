## Kartchamp ##

This application is responsible for kartrace.cz races management.

### Building application ###

- Download and install Maven 3 (http://maven.apache.org/download.html#Installation)
- Go the root directory of project (The one which contains the pom.xml file)
- Run command mvn clean install (should finish with BUILD SUCCESS)

### Naming ###
Race - An event in which all teams participate and based on their performance, overall team and driver results are counted
Round - A part of the event, for which team and driver results can be counted. Might be repeated to achieve more fair results (to allow all karts to be used by the teams).
Ride - A part of the round, which usually needs to be repeated with different teams/drivers to get enough results to be able to create some result.
Kart ride - A single kart (used by some team/driver) result (time, position etc.) achieved during single ride.

### Race formats ###
#### Fair Sprints ####
Fair sprints implements a race, where in each ride, all teams have one kart (driver). For each such ride, team (and driver)
receives points. In each ride, karts start from the same starting position. Starting position of the team is different
in earch ride. Initial team order is set by the current order in the championship. In each next race team get a kart further
in the starting field. So for example team, which is leading a championship have a first kart in first race, second kart in
second race etc. After each team has used each kart, points are summarized for teams and drivers and that creates overall
results of the round. It's possible to run multiple rounds (results are then again summarized).

In each kartRide, main attributes are selected in this way:
input: teamOrder, teams, karts (teamCount == kartCount)

* assign one kart to every kart ride in every ride
* assign starting position to each kart (by it's order)
* for each ride (rideIndex = 0 to teamCount)
** assign starting position in ride for each team (= (teamOrder + rideIndex) % teamCount) (e.g. 1 to teamCount)
** for each kart ride (kartRideIndex 0 to teamCount)
*** reset previous results and assignments
*** get starting position for kart (from kart start positions)
*** assign team (get team for starting position)
*** driver is assigned later

For each ride, results are sorted by finish position and both team and driver receive same points.
For round results points from rides for both teams and drivers are summarized
For overall results points from rounds for both teams and drivers are summarized

#### Fair Challenge ####


#### Fair Qualification ####

In each kartRide, main attributes are selected in this way:
input: teamOrder, teams, karts (3 * teamCount % kartCount == 0)

* assign one kart to every kart ride in every ride
* sort karts by order (by their number) to create kartOrder
* for each ride (rideIndex = 0 to rideCount)
*** find teams to participite in ride (those having teamOrder + (rideOrder * (teamCount - kartCount)) % teamCount less then kartCount)
*** store kart to be used by each participating team in kartRide (kartOrder[teamOrder[(rideIndex * kartCount) % teamCount]]
** for each kart ride (kartRideIndex 0 to kartCount)
*** reset previous results and assignments
*** assign team (get team for kart)
*** driver is assigned later

There are no ride results (makes no sense)
For round results, results are sorted by time and both team and driver receive same points (if same time is achieved, lower lap in which was made is better).
For overall team results, points from rounds for teams are summarized (if same points are achieved, higher number of lower position wins).
For overall driver results, it's complicated.

