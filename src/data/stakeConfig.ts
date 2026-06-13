/** Engagement lié à l’objectif sport */
export const SPORT_STAKE = {
  amount: 20,
  currency: '€',
  recipient: 'Marion',
  get label() {
    return `${this.amount}${this.currency}`
  },
  get rule() {
    return `Si l’objectif n’est pas atteint dans la semaine, ${this.label} pour ${this.recipient}.`
  },
} as const
