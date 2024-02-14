export interface IStore {
  period: string;
  red: string[];
  blue: string;
}
class LotteryDatabase {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, dbVersion: number) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  public openDatabase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore("lottery", { keyPath: "period" });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  public addLotteryResult(period: string, numbers: string): Promise<IStore> {
    return new Promise<IStore>((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not open"));
        return;
      }

      const transaction = this.db.transaction(["lottery"], "readwrite");
      const store = transaction.objectStore("lottery");
      const [redStr, blue] = numbers.split("+");
      const newRecord = {
        period,
        red: redStr.split(","),
        blue,
      };
      const request = store.put(newRecord);

      request.onsuccess = () => {
        resolve(newRecord);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public getLotteryResult(period: string): Promise<IStore> {
    return new Promise<IStore>((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not open"));
        return;
      }

      const transaction = this.db.transaction(["lottery"], "readonly");
      const store = transaction.objectStore("lottery");
      const request = store.get(period);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
  public getAllLotteryResults(): Promise<IStore[]> {
    return new Promise<IStore[]>((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not open"));
        return;
      }

      const transaction = this.db.transaction(["lottery"], "readonly");
      const store = transaction.objectStore("lottery");
      const results: IStore[] = [];

      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;

        if (cursor) {
          results.push({
            ...cursor.value,
          });
          cursor.continue();
        } else {
          results.sort((a, b) => Number(b.period) - Number(a.period));
          resolve(results);
        }
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
}

export const database = new LotteryDatabase("MyLotteryDB", 1);
