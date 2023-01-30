export function Sleep(ms: number) {
  return new Promise(resolve =>
    setTimeout(resolve, ms));
}

export async function Interval(continueConditionRule: () => boolean, step: number, max: number) {
  let total_time = 0;

  while(continueConditionRule() && total_time < max) { // we will stop once the continueConditionRule is false or the total time has exceeded the max milliseconds
    await Sleep(step);
    total_time += step;
  }
}
