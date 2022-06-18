import Bar from "@/components/Bar";
import './index.scss';

// 1 看官方文档 
// 如何在react获取dom -> useRef
// 在什么地方获取dom节点 -> useEffect

const Home = () => {
    
    return (<div>
        <Bar 
            title="主流框架使用满意度" 
            xData={['react', 'vue', 'angular']}
            yData={[30, 40, 50]}
            style={{height: '500px', width: '400px'}}
        ></Bar>
        <Bar
            title="主流框架使用满意度1"
            xData={['react', 'vue', 'angular']}
            yData={[10, 40, 10]}
            style={{height: '400px', width: '500px'}}
        ></Bar>
    </div>);
}
export default Home;
