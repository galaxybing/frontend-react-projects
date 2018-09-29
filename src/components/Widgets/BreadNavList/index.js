import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import styles from "./style.css";

export default function BreadNavList({ dataSource, showActionButton }) {
  let data = dataSource;
  return (
    <div className={styles["bread-nav-sprite"]}>
      <div className={styles["nav-list"]}>
        {data.map((item, ind) => {
          if (data.length - 1 == ind) {
            return (
              <p key={"bread-nav-item-" + ind} className={styles.nav}>
                {item.name}
              </p>
            );
          }
          return (
            <p key={"bread-nav-item-" + ind} className={styles.nav}>
              {(() => {
                let tpl;
                if (item.type === 'a') {
                  // 使用<a>跳转
                  tpl = (
                    <a className={styles["link-nav"]} href={item.link}>
                      {item.name}
                    </a>
                  );
                } else {
                  if (item.link) {
                    tpl = <Link className={styles["link-nav"]} to={{
                      pathname: item.link,
                      search: item.search,
                      state: item.state
                    }}
                    >
                      {item.name}
                    </Link>
                  } else {
                    tpl = <a className={styles["link-nav"]}>{item.name}</a>
                  }
                }
                return tpl;
              })()}
            </p>
          );
        })}
      </div>
      {showActionButton && showActionButton()}
    </div>
  );
}
