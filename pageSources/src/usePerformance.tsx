import { useEffect, useState } from "react";

function getEntryTiming(t: any) {
  return {
    // 重定向的时间
    redirect: t.redirectEnd - t.redirectStart,
    // DNS 查询时间
    lookupDomain: t.domainLookupEnd - t.domainLookupStart,
    // 内容加载完成的时间c
    request: t.responseEnd - t.requestStart,
    // TCP 建立连接完成握手的时间
    connect: t.connectEnd - t.connectStart,
    // 挂载 entry 返回
    name: t.name,
    entryType: t.entryType,
    initiatorType: t.initiatorType,
    duration: t.duration
  };
}

const usePerformance = () => {
  const [perform, setPerform] = useState<any>([]);
  useEffect(() => {
    setPerform(performance.getEntries().map((entry) => getEntryTiming(entry)));
  }, [performance]);
  return perform;
};
export default usePerformance;
