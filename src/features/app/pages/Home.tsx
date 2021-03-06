import { Box, Button, Divider, Grid, Hidden } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";

import { useHistory } from "react-router-dom";
import { useTranslations } from "../../../shared/hooks/useTranslations";
import { stylesFactory } from "../../../shared/utils";
import { useConfig } from "../../../shared/hooks";

const useStyles = stylesFactory({
  mainContainer: {
    paddingRight: 20,
    paddingLeft: 20,
    height: "100%",
  },
  itemContainer: {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  img: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "50%",
  },
});

export const Home = () => {
  const styles = useStyles();
  const { messages } = useTranslations();
  const history = useHistory();
  const config = useConfig();

  return (
    <Box height="calc(100vh - 4px - 72px - 30px - 30px)">
      <Grid container className={styles.mainContainer}>
        <Grid item sm={5} xs={12} className={styles.itemContainer}>
          <img
            alt="logo"
            className={styles.img}
            src="/patient_hub/main_page.png"
          />
        </Grid>

        <Hidden smDown>
          <Grid item xs={1}>
            <Divider orientation="vertical" />
          </Grid>
        </Hidden>

        <Grid item xs={12} sm={6} className={styles.itemContainer}>
          <Box>
            {!config.disableAdverseDrugReactions && (
              <Button
                fullWidth
                endIcon={<ChevronRight />}
                variant="contained"
                color="primary"
                onClick={() => history.push("/adverse-drug-reactions")}
              >
                {messages.recordAnADR}
              </Button>
            )}
            <Box mt={2} />
            {!config.disableRegistration && (
              <Button
                fullWidth
                endIcon={<ChevronRight />}
                variant="contained"
                color="primary"
                onClick={() => history.push("/patients")}
              >
                {messages.registerPatient}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
