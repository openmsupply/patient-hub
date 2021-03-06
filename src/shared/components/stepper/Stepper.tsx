import React, { FC } from "react";
import {
  Grid,
  Box,
  Paper,
  Stepper as MuiStepper,
  Step,
  StepButton,
  StepLabel,
} from "@material-ui/core";
import { StepperContext, useStepperInternalState } from "./StepperContext";
import { stylesFactory } from "../../utils";
import { useIsSmallScreen } from "../../hooks";

const useStyles = stylesFactory({
  paper: { padding: 20, marginBottom: 20 },
});

export const Stepper: FC<{ labels: string[] }> = ({ children, labels }) => {
  const isSmallScreen = useIsSmallScreen();
  const classes = useStyles();
  const contextState = useStepperInternalState(labels);
  const { completed, currentStep, toStep } = contextState;

  return (
    <StepperContext.Provider value={contextState}>
      <Box m={2}>
        {!isSmallScreen ? (
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Box display={{ xs: "none", sm: "block" }}>
                <Paper className={classes.paper}>
                  <MuiStepper activeStep={currentStep} style={{ flex: 1 }}>
                    {labels.map((label, i) => (
                      <Step key={`${label}${i}`} completed={completed[i]}>
                        <StepButton onClick={() => toStep(i)}>
                          <StepLabel>{label}</StepLabel>
                        </StepButton>
                      </Step>
                    ))}
                  </MuiStepper>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        ) : null}
        {React.Children.toArray(children).map((child, i) => {
          return (
            <Box key={i} display={i === currentStep ? "block" : "none"}>
              {child}
            </Box>
          );
        })}
      </Box>
    </StepperContext.Provider>
  );
};
