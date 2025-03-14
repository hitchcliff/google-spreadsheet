import $ from "jquery";

export default class Spreadsheet {
  data = {};
  endpoint: string = "";
  success = undefined;
  error = undefined;

  public submit() {
    // if (!this.validate) return null; // return if something goes wrong

    $.ajax({
      type: "POST",
      url: this.endpoint,
      data: {
        Date: this.getCurrentDate(),
        ...this.data,
      },
      success: this.success,
      error: this.error,
    });
  }

  public getCurrentDate() {
    const date = new Date().toLocaleDateString("en-US", {
      timeZone: "America/New_York",
    });
    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
    });
    return `${date} - ${time} (GMT-4)`;
  }

  // private validate() {
  //   if (!this.name || !this.email || !this.endpoint || !this.successMessage) {
  //     return false;
  //   }

  //   return true;
  // }
}

(window as any).Spreadsheet = Spreadsheet;
