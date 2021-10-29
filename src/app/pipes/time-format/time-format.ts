/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Pipe, PipeTransform } from "@angular/core";

/**
 * Generated class for the TimeFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: "timeFormat"
})
export class TimeFormatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    if (typeof value === "undefined" || value == null || value == "") {
      return "";
    } else {
      return value.slice(12, 16);
    }
  }
}
