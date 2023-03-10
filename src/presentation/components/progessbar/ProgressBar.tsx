import * as React from "react";
import clsx from "clsx";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: any) =>
    createStyles({
      root: {
        border: `1px solid`,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: 26,
        borderRadius: 2
      },
      value: {
        position: "absolute",
        lineHeight: "24px",
        width: "100%",
        display: "flex",
        justifyContent: "center"
      },
      bar: {
        height: "100%",
        "&.low": {
          backgroundColor: "#088208a3"
        },
        "&.medium": {
          backgroundColor: "#efbb5aa3"
        },
        "&.high": {
          backgroundColor: "#f44336"
        }
      }
    }),
  { defaultTheme }
);
interface ProgressBarProps {
  value: number;
}

const ProgressBar = React.memo(function ProgressBar(props: ProgressBarProps) {
  const { value } = props;;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.value}>
        {`${value.toLocaleString()} %`}
      </div>

      <div
        className={clsx(classes.bar, {
          low: value < 30,
          medium: value >= 30 && value <= 70,
          high: value > 70
        })}
        style={{ maxWidth: `${value}%` }}
      />
    </div>
  );
});

export default ProgressBar;
