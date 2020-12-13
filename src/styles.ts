
export const linkStyles = (color) => ({
  '& a': {
    color,
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline'
    },
    '&:visited': {
      color
    }
  }
})
