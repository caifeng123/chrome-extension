import { Button, Table, Tabs, Tooltip } from "antd";
import { useMemo, useState } from "react";
const { TabPane } = Tabs;

type widgetType = {
	[key: string]: any;
};

const widgetMap: widgetType = {
	image: (props: any) => <img width="100px" alt="" {...props} />,
	video: (props: any) => (
		<>
			<video controls autoplay width="450px" {...props} />
			{console.log(props.tempRequest)}
		</>
	),
};

async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

const download = async (url: string, mineType: any) => {
	const tab = await getCurrentTab();
	chrome.tabs.sendMessage(tab.id!, { url, mineType });
};

const getByteContent = (num: number) => {
	let i = 0;
	const units = ['B', 'KB', 'MB', 'GB']
	while (num > 1024) {
		num /= 1024;
		i++;
	}
	return (num).toFixed(2) + units[i];
}

const columns = [
	{
		title: "类型",
		dataIndex: "type",
		key: "type",
		width: 50,
	},
	{
		title: "链接",
		dataIndex: "url",
		key: "url",
		width: 120,
		render: (
			url: string,
			{ type, tempRequest }: { type: string; tempRequest: any }
		) => {
			const Component = widgetMap[type];
			if (!Component) {
				return url.slice(0, 30);
			}
			return <Component src={url} tempRequest={tempRequest} />;
		},
	},
	{
		title: "文件大小",
		dataIndex: "contentSize",
		width: 50,
		key: "contentSize",
		render: (_: string, { tempRequest }: any) => {
			return getByteContent(tempRequest?.response?.content?.size ?? 0)
		},
	},
	{
		title: "格式",
		dataIndex: "mineType",
		width: 50,
		key: "mineType",
	},
	{
		title: "下载",
		dataIndex: "download",
		width: 50,
		key: "download",
		render: (_: string, { type, url, mineType }: any) =>
			<Tooltip placement="left" title={url}>
				<Button onClick={() => download(url, mineType)}> 下载</Button>
			</Tooltip >

	},
];

const Test = () => {
	const [data, setData] = useState<any>({});
	const tabs = Object.keys(data);
	const handleFreash = () => {
		chrome.runtime.sendMessage({
			source: "refreash",
		});
	};
	useMemo(
		() =>
			chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
				setData(message.data);
			}),
		[]
	);

	return (
		<>
			<Button onClick={handleFreash}>刷新</Button>
			<Tabs defaultActiveKey={tabs[0]}>
				{tabs.map((tab) => (
					<TabPane tab={tab} key={tab}>
						{<Table columns={columns} dataSource={data[tab]} />}
					</TabPane>
				))}
			</Tabs>
		</>
	);
};

export default Test;


