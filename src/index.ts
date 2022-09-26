import swal from "sweetalert2";
import $ from "jquery";

export default class Spreadsheet {
  name: string = "";
  email: string = "";
  endpoint: string = "";
  successMessage: string[] = [];

  public submit() {
    if (!this.validate) return null; // return if something goes wrong

    $.ajax({
      type: "POST",
      url: this.endpoint,
      data: {
        Date: this.getCurrentDate(),
        Name: this.name,
        Email: this.email,
      },
      success: () => {
        swal.fire(...this.successMessage);
      },
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

  private validate() {
    if (!this.name || !this.email || !this.endpoint || !this.successMessage) {
      return false;
    }

    return true;
  }
}

(window as any).Spreadsheet = Spreadsheet;
