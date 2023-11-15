export interface CategoryCreate {
  /**
   * Наименование категории
   */
  name: string,
  /**
   * Является ли категория доходом?
   */
  isIncome: boolean
}
