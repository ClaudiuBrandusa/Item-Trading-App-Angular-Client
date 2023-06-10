const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60;   //     60,000
const MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60;     //  3,600,000
const MILLIS_PER_DAY = MILLIS_PER_HOUR * 24;        // 86,400,000

export class TimeSpan {
  constructor(private _milliseconds: number) {

  }

  public get days(): number {
    return TimeSpan.round(this._milliseconds / MILLIS_PER_DAY);
  }

  public get hours(): number {
      return TimeSpan.round((this._milliseconds / MILLIS_PER_HOUR) % 24);
  }

  public get minutes(): number {
      return TimeSpan.round((this._milliseconds / MILLIS_PER_MINUTE) % 60);
  }

  public get seconds(): number {
      return TimeSpan.round((this._milliseconds / MILLIS_PER_SECOND) % 60);
  }

  public get milliseconds(): number {
      return this._milliseconds;
  }

  public get totalDays(): number {
      return this._milliseconds / MILLIS_PER_DAY;
  }

  public get totalHours(): number {
      return this._milliseconds / MILLIS_PER_HOUR;
  }

  public get totalMinutes(): number {
      return this._milliseconds / MILLIS_PER_MINUTE;
  }

  public get totalSeconds(): number {
      return this._milliseconds / MILLIS_PER_SECOND;
  }

  public get total_milliseconds(): number {
      return this._milliseconds;
  }

  // private

  private static round(n: number): number {
    if (n < 0) {
        return Math.ceil(n);
    } else if (n > 0) {
        return Math.floor(n);
    }

    return 0;
  }
}