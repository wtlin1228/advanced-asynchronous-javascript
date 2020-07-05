consts tasks = 
{
....{....5......2.......3...}
.............{......5...........4......3}
...............................................{5....2....4}
...........................................................{...5}
}

animationsAllowed = 
{....false..............................true....false............true}

tasks.map(task => task.filter(() => false))

consts tasks = 
{
....{.......................}
.............{..........................}
...............................................{...........}
...........................................................{....}
}

tasks.map(task => 
  Observable.concat(
    Observable.of(1),
    task.filter(() => false),
    Observable.of(-1)))

consts tasks = 
{
....{1.......................-1}
.............{1..........................-1}
...............................................{1...........-1}
...........................................................{1....-1}
}

tasks.map(task => 
  Observable.concat(
    Observable.of(1),
    task.filter(() => false),
    Observable.of(-1))).
  mergeAll()

consts tasks = {....1........1..............-1..........-1....1.........1..-1..-1}

tasks.map(task => 
  Observable.concat(
    Observable.of(1),
    task.filter(() => false),
    Observable.of(-1))).
  mergeAll().
  scan((acc, curr) => acc + curr, 0)

consts tasks = {....1........2..............1..........0....1.........2..1..0}

tasks.map(task => 
  Observable.concat(
    Observable.of(1),
    task.filter(() => false),
    Observable.of(-1))).
  mergeAll().
  scan((acc, curr) => acc + curr, 0).
  map(value => value === 0)

consts tasks = {....f........f..............f..........t....f.........f..f..t}

tasks.map(task => 
  Observable.concat(
    Observable.of(1),
    task.filter(() => false),
    Observable.of(-1))).
  mergeAll().
  scan((acc, curr) => acc + curr, 0).
  map(value => value === 0).
  distinctUntilChanged()

consts tasks = {....f..................................t....f...............t}

handle error:
tasks.map(task => 
  Observable.concat(
    Observable.of(1),
    task.
      filter(() => false).
      catch((e) => Observable.error(new SomeError(e))),
    Observable.of(-1))).
  mergeAll().
  scan((acc, curr) => acc + curr, 0).
  map(value => value === 0).
  distinctUntilChanged()
