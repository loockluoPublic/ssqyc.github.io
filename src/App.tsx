import { useEffect, useState } from "react";

import "./App.css";
import { getHistory } from "./request";
import { IStore, database } from "./db";
import { predictNextLottery, predictNextLottery2 } from "./next";
import { Table } from "antd";
import type { TableProps } from "antd";
import CountUp from "react-countup";

const columns: TableProps<IStore>["columns"] = [
  {
    title: "开奖期数",
    dataIndex: "period",
    key: "period",
  },
  {
    title: "红球1",
    className: "red",
    dataIndex: "red",
    render: (item) => {
      return item[0];
    },
    key: "item[0]",
  },
  {
    title: "红球2",
    className: "red",
    dataIndex: "red",
    render: (item) => {
      return item[1];
    },
    key: "item[1]",
  },
  {
    title: "红球3",
    className: "red",
    dataIndex: "red",
    render: (item) => {
      return item[2];
    },
    key: "item[2]",
  },
  {
    title: "红球4",
    className: "red",
    dataIndex: "red",
    render: (item) => {
      return item[3];
    },
    key: "item[3]",
  },
  {
    title: "红球5",
    className: "red",
    dataIndex: "red",
    render: (item) => {
      return item[4];
    },
    key: "item[4]",
  },
  {
    title: "红球6",
    className: "red",
    dataIndex: "red",
    render: (item) => {
      return item[5];
    },
    key: "item[5]",
  },
  {
    title: "蓝球",
    className: "blue",
    dataIndex: "blue",
    key: "blue",
  },
];
function App() {
  const [list, setList] = useState<IStore[]>([]);

  const [next, setNext] = useState<IStore | undefined>();
  const [next2, setNext2] = useState<IStore | undefined>();
  console.log("%c Line:83 🍿 next2", "color:#ea7e5c", next2);

  const getNext = () => {
    const next = predictNextLottery(list);
    setNext(next);
  };

  useEffect(() => {
    getHistory().then(() => {
      database.openDatabase().then(() => {
        database.getAllLotteryResults().then((res) => {
          const next = predictNextLottery(res);
          setNext(next);
          setNext2(predictNextLottery2(res));
          setList(res);
        });
      });
    });
  }, []);

  return (
    <>
      <h2>双色球彩票预测系统</h2>
      <div className="flex">
        <div>
          <Table
            columns={columns}
            dataSource={list}
            // size="small"
            pagination={{
              pageSize: 10,
            }}
          />
        </div>
        <div style={{ flexGrow: "1", padding: "5em" }}>
          <div>
            <div className="boll">
              <span>最高概率：</span>
              {next2?.red?.map?.((r, i) => {
                return (
                  <CountUp
                    className="redBoll"
                    key={i}
                    start={0}
                    end={Number(r)}
                    duration={2}
                  />
                );
              })}
              {next2?.blue && (
                <CountUp
                  className="blueBoll"
                  start={0}
                  end={Number(next2?.blue)}
                  duration={2}
                />
              )}
            </div>
            <div className="boll">
              <span>尾数概率：</span>
              {next2?.tail?.map?.((r, i) => {
                return (
                  <CountUp
                    className="redBoll"
                    key={i}
                    start={0}
                    end={Number(r)}
                    duration={2}
                  />
                );
              })}
            </div>
            <div className="boll">
              <span>蓝球概率：</span>
              {next2?.blue6?.map?.((r, i) => {
                return (
                  <CountUp
                    className="blueBoll"
                    key={i}
                    start={0}
                    end={Number(r)}
                    duration={2}
                  />
                );
              })}
            </div>
            <div className="boll">
              <span>算法预测：</span>
              {next?.red?.map?.((r, i) => {
                return (
                  <CountUp
                    className="redBoll"
                    key={i}
                    start={0}
                    end={Number(r)}
                    duration={2}
                  />
                );
              })}
              {next?.blue && (
                <CountUp
                  className="blueBoll"
                  start={0}
                  end={Number(next?.blue)}
                  duration={2}
                />
              )}
            </div>
            <div className="nextBtn">
              <button onClick={getNext}>再预测一次</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
