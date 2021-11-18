import styles from "./Home.module.scss";
import clsx from "clsx";
const Home = () => {
  return (
    <div
      className={clsx(
        styles["home-container"],
        "position-absolute",
        "h-100",
        "w-100",
        "p-5",
        "d-flex",
        "flex-column",
        "justify-content-between"
      )}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className={styles["name-header"]}>STEPHEN</div>
        <div className={clsx("JW-font", styles["about-header"])}>ABOUT</div>
      </div>
      <div
        className={clsx(
          "d-flex",
          "justify-content-between",
          "JW-font",
          "font-sm",
          "d-flex",
          "justify-content-between",
          "align-items-end",
          "w-100"
        )}
      >
        <div className={styles["intro-container"]}>
          <div>FRONT-END BEGINEER</div>
          <div>WORK IN BYTEDANCE</div>
        </div>
        <div className={styles["social-app-container"]}>
          <div>EMAIL</div>
          <div>INSTAGRAM</div>
          <div>LINKEDIN</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
