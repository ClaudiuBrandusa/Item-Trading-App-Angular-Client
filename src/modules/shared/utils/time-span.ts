const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60;   //        60,000
const MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60;     //     3,600,000
const MILLIS_PER_DAY = MILLIS_PER_HOUR * 24;        //    86,400,000
const MILLIS_PER_MONTH = MILLIS_PER_DAY * 30;       // 2,592,000,000

export class TimeSpan {
  constructor(private _milliseconds: number) {

  }

  public get months(): number {
    return TimeSpan.round(this.totalMonths);
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

  public get totalMonths(): number {
    return this._milliseconds / MILLIS_PER_MONTH;
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

  public get total_time_as_string(): string {
    if (this.months > 0) {
      return this.months > 1 ? this.months + " months ago" : "One month ago";
    } else if (this.totalDays >= 1) {
      return this.days > 1 ? this.days + " days ago" : "Today";
    } else if (this.totalHours >= 1) {
      return this.hours > 1 ? this.hours + " hours ago" : "One hour ago";
    } else if (this.totalMinutes >= 1) {
      return this.minutes > 1 ? this.minutes + " minutes ago" : "One minute ago";
    } else if (this.totalSeconds >= 1) {
      return this.totalSeconds > 15 ? this.seconds + " seconds ago" : "A few seconds ago";
    } else {
      return "Now";
    }
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