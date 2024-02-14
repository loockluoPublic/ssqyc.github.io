import { database } from "./db";

const appInfo = {
  app_id: "lrkxnlpxwfzpkdmk",
  app_secret: "6BiC1G5s4Je8lSGeo6fPHod9RSvfV55l",
  code: "ssq",
};
// https://www.mxnzp.com/api/lottery/common/history?code=ssq&size=50&app_id=lrkxnlpxwfzpkdmk&app_secret=6BiC1G5s4Je8lSGeo6fPHod9RSvfV55l
const host = "https://www.mxnzp.com/api/lottery/common/";

function objectToQueryString(obj: any): string {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }

  return params.toString();
}

const request = (api: string, params: Record<string, any>) => {
  return fetch(
    `${host}${api}?${objectToQueryString({ ...appInfo, ...params })}`
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 1) return res.data;
      else {
        console.error(res.msg);
        throw new Error(res.msg);
      }
    });
};

export const getHistory = () =>
  request("history", {
    size: 50,
  }).then((res) => {
    return database.openDatabase().then(() => {
      const data = res;
      return data.map((item: any) => {
        return database.addLotteryResult(item.expect, item.openCode);
      });
    });
  });

export const aimLottery = (expect: string) =>
  request("aim_lottery", {
    expect,
  }).then((res) => {
    return database.openDatabase().then(() => {
      const data = res;
      return database.addLotteryResult(data.expect, data.openCode);
    });
  });
