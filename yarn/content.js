let CreateYarn = class {
    #registerCDN = [];

    constructor() {
        // 记录已经安装的包
        this.packages = [];
        // 注册cdn函数列表，用作cdn挂时callback
        this.#registerCDN = [this.#cdnjs, this.#jsdelivr];
    }

    // 注册cdn列表，竞态添加包
    add = async packageName => {
        try {
            const detail = await Promise.any(this.#registerCDN.map(cdn => cdn(packageName)));
            this.#addYarn(detail);
        } catch (error) {
            this.#fail(packageName);
        }
    }

    // cdnjs方式
    #cdnjs = async packageName => {
        try {
            const res = await fetch(`https://api.cdnjs.com/libraries/${packageName}`).then(res => res.json());
            if (!res.error) {
                return {src: res.latest, version: res.version, packageName, cdn: 'cdnjs'};
            }
            throw new Error();
        } catch (error) {
            throw new Error();
        }
    }

    // jsdelivr方式
    #jsdelivr = async packageName => {
        try {
            const tempUrl = `https://cdn.jsdelivr.net/npm/${packageName}`;
            const access = await fetch(tempUrl);
            if(access.ok) {
                return {src: tempUrl, packageName, cdn: 'jsdelivr'};
            }
            throw new Error();
        } catch (error) {
            throw new Error();
        }
    }

    // 报错提示
    #fail = packageName => console.log(`用${this.#registerCDN.length}种方式加载, 发现${packageName}此包不存在, 请检查包名是否正确`);

    // 实际操作安装函数
    #addYarn = detail => {
        const {src, version = '', packageName, cdn} = detail;

        console.time("耗时");
        console.log("加载中.... please wait a moment");
        const scrpit = document.createElement("script");
        scrpit.src = src;
        scrpit.onload = () => {
            const showPackageInfo = `cdn: ${cdn} - 加载了${packageName}${version ? `@${version}` : ''}`;
            console.log(`加载完成✅ ${showPackageInfo}`);
            console.timeEnd("耗时");
            this.packages.push(detail);
        };
        document.body.appendChild(scrpit);
    }
}

const yarn = new CreateYarn();