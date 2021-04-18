import React from "react"
import { scrollToElement } from "../utils"
import { FaRegArrowAltCircleDown } from "react-icons/fa"
import clsx from "clsx"
import { createStyles, makeStyles } from "@material-ui/core"

export interface NextPageButtonProps {
  id: string;
  style?: "light" | "dark";
  className?: string;
}

const useStyles = makeStyles((theme) => createStyles({
  centered: {
    margin: '0 auto'
  },
  'light': {
    'color': 'rgba(255, 255, 255, 0.5)'
  },
  'dark': {
    'color': 'rgba(0, 0, 0, 0.5)'
  },
  'next': {
  'flex': '0 0 auto',
  'cursor': 'pointer',
  'transition': 'color 350ms ease-in',
    '&:hover': {
      'color': theme.palette.secondary.main
    }
  }
}))

export function NextPageButton({ id, style, className }: NextPageButtonProps) {
  const styles = useStyles();

  const classes =  {
    [styles.next]: true,
    [styles.light]: !style || style === "light",
    [styles.dark]: style === "dark"
  };

  return (<span className={clsx(classes, className)} onClick={() => scrollToElement(id)}>
    <FaRegArrowAltCircleDown size={75} className={styles.centered} />
  </span>);
}
