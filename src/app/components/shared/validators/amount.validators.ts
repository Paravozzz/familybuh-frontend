import {AbstractControl, ValidatorFn } from "@angular/forms";

export function amountCorrectValueValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): { [key: string]: boolean } | null => {
    let value = control.value.toString().trim();
    if (value === '')
      return null;

    let decimalValue: number = Number.parseFloat(control.value);
    if (Number.isNaN( decimalValue)) {
      return {incorrectValue: true};
    }
    let digits = ['+','-', '.','0','1','2','3','4','5','6','7','8','9'];
    for (let i = 0; i < value.length; i++) {
      let c = value.charAt(i);
      if (!digits.includes(c))
        return {incorrectValue: true};
    }

    return null;
  };
}

export function amountPositiveOrZeroValueValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): { [key: string]: boolean } | null => {
    let decimalValue: number = Number.parseFloat(control.value);
    if (Number.isNaN( decimalValue)) {
      return null;
    }
    if (Math.sign(decimalValue) < 0) {
      return {positiveOrZero: true};
    }
    return null;
  };
}
