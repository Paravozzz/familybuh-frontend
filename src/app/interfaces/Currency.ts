export interface Currency {
  /**
   * Цифровой код валюты
   */
  id: string,
  /**
   * Буквенный код валюты
   */
  code: string,
  /**
   * Наименование валюты
   */
  name: string,
  /**
   * Количество знаков дробной части
   */
  decimal: number
}
