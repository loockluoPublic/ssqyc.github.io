interface IStore {
  period: string;
  red: string[];
  blue: string;
}

export function predictNextLottery2(d: IStore[]): IStore {
  const historyData = [...d];
  const redBallFrequency: { [key: string]: number } = {};
  const blueBallFrequency: { [key: string]: number } = {};
  // 统计每个红球的出现频率
  historyData.forEach((periodData) => {
    periodData.red.forEach((redBall) => {
      redBallFrequency[redBall] = (redBallFrequency[redBall] || 0) + 1;
    });
    blueBallFrequency[periodData.blue] =
      (blueBallFrequency[periodData.blue] || 0) + 1;
  });

  // 根据频率选择可能的红球
  const likelyRedBalls = Object.keys(redBallFrequency)
    .sort((a, b) => redBallFrequency[b] - redBallFrequency[a])
    .slice(0, 6);

  // 随机选择一个蓝球
  const likelyBlueBall = Object.keys(blueBallFrequency).sort(
    (a, b) => blueBallFrequency[b] - blueBallFrequency[a]
  )[0];

  return {
    red: likelyRedBalls,
    blue: likelyBlueBall,
    period: getNextPeriod(historyData),
  };
}

export function predictNextLottery(d: IStore[]): IStore {
  const historyData = [...d];
  const redBallFrequency: { [key: string]: number } = {};

  // 统计每个红球的出现频率
  historyData.forEach((periodData) => {
    periodData.red.forEach((redBall) => {
      redBallFrequency[redBall] = (redBallFrequency[redBall] || 0) + 1;
    });
  });

  // 根据频率选择可能的红球
  const likelyRedBalls = Object.keys(redBallFrequency)
    .sort((a, b) => redBallFrequency[b] - redBallFrequency[a])
    .slice(0, 6);

  // 打乱红球顺序
  const shuffledRedBalls = shuffleArray(likelyRedBalls);

  // 随机选择一个蓝球
  const likelyBlueBall =
    historyData[Math.floor(Math.random() * 100) % historyData?.length]?.blue;

  return {
    red: shuffledRedBalls,
    blue: likelyBlueBall,
    period: getNextPeriod(historyData),
  };
}

function getNextPeriod(historyData: IStore[]): string {
  const lastPeriod = historyData[historyData.length - 1];
  const currentPeriodNumber = parseInt(lastPeriod.period, 10);
  const nextPeriodNumber = currentPeriodNumber + 1;
  return nextPeriodNumber.toString().padStart(7, "0");
}

function shuffleArray(array: string[]): string[] {
  // Fisher-Yates shuffle 算法
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
