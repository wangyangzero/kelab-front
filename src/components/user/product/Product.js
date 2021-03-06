/*自然语言处理产品界面*/
import React,{Component} from 'react';
import UserHead from "../common/UserHead"
import Footer from '../common/Footer';
import {getDocMenu} from "../../../redux/action/user/product";
import { Input,Menu,  Breadcrumb } from 'antd';
import {connect} from 'react-redux'
import {Link,BrowserRouter} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import "./Product.less";

const SubMenu = Menu.SubMenu;
const Search = Input.Search;

class Product extends Component{
    constructor(props){
        super(props);
        this.state={
            //菜单当前选中项
            current: '1',
            //导航菜单
            docMenu: [],
            //分类索引
            menuIndex: '',
            //当前文档key值
            docKey: 0,
        }
    }

    /**
     * 组件加载完毕用于ajax请求
     */
    componentDidMount(){
        this.props.dispatch(getDocMenu({
            serverId: window.location.hash.replace('#',''),
        })).then(() =>{
            if(!!this.props.product.getDocMenu){
                if(this.props.product.getDocMenu.code === 'SUCCESS') {
                    this.setState({
                        docMenu:this.props.product.getDocMenu.data
                    })
                }
            }
        })
    }

    /**
     * 更新menu的key
     * @param e
     */
    navChange = (e) => {
        this.setState({
            current: e.key,
        });
        this.getMenuIndex(window.location.hash)

    };

    /**
     * 获取当前菜单索引
     * @returns {*}
     */
    getMenuIndex = (e) =>{
        e = parseInt(e.replace('#/',''));
        if(this.state.docMenu.length !== 0){
            for (let i = 0;i < this.state.docMenu.docSubVos.length;i++){
                for(let j = 0;j < this.state.docMenu.docSubVos[i].docEntities.length;j++){
                    if(e === this.state.docMenu.docSubVos[i].docEntities[j].id){
                        this.setState({
                            menuIndex: this.state.docMenu.docSubVos[i].docEntities[j].docSubId
                        })
                    }
                }
            }
        }

    };
    /**
     * 渲染新一页的菜单
     */
    renderDoc = (e) => {
        this.setState({
            docKey: e.key
        })
    }

    render(){

        //获取菜单
        let subMenuData = [];
        let docMenu = this.state.docMenu;
        //具体单项服务名字索引
        let subjectIndex = [];
        //获取每项服务的markdown字符串
        let subjectDoc = [];
        if(docMenu.length !== 0){
            if(docMenu.docSubVos.length !== 0){
                for (let i = 0;i < docMenu.docSubVos.length;i++){
                    let MenuData = [];
                    for (let j = 0;j < docMenu.docSubVos[i].docEntities.length;j++){
                        let key = docMenu.docSubVos[i].docEntities[j].id.toString();
                        let href = window.location.pathname + '#/' + key;
                        MenuData.push(
                            <Menu.Item key={key} onClick={this.renderDoc}><Link to={href}>{docMenu.docSubVos[i].docEntities[j].name}</Link></Menu.Item>
                        );
                        subjectIndex.push(docMenu.docSubVos[i].docEntities[j].name)
                        subjectDoc.push(docMenu.docSubVos[i].docEntities[j].markdownCode)
                    }
                    let key = docMenu.docSubVos[i].id;
                    subMenuData.push(
                        <SubMenu key={key} title={<span>{this.state.docMenu.docSubVos[i].name}</span>}>
                            {MenuData}
                        </SubMenu>
                    )
                }
            }
        }

        return(
            <div>
                <div className="product-header">
                    <UserHead />
                </div>
                <div className="product-content">
                    <div className="product-menuNav">
                    <Menu
                        theme={this.state.theme}
                        onClick={this.navChange}
                        style={{ width: 256 }}
                        defaultOpenKeys={['sub1']}
                        selectedKeys={[this.state.current]}
                        mode="inline"
                    >
                        <h2>{this.state.docMenu.name}</h2>
                        <hr />
                        {subMenuData}
                    </Menu>
                    </div>
                    <div className="product-dataList">
                        <Breadcrumb>
                            <Breadcrumb.Item><Link to={'/product'}>主页</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <BrowserRouter forceRefresh={true}><Link to={window.location.pathname} >{this.state.docMenu.name}</Link></BrowserRouter>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{this.state.menuIndex === '' ? "简介" :
                                this.state.docMenu.docSubVos[this.state.menuIndex - 1].name}</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {subjectIndex.length === 0 ? "" : subjectIndex[this.state.current - 1]}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Search
                            placeholder="请输入关键词"
                            onSearch={value => console.log(value)}
                            style={{ width: 200}}
                        />
                        <ReactMarkdown source={subjectDoc[this.state.docKey]} />
                    </div>
                </div>
                <div className="product-footer">
                    <Footer />
                </div>
            </div>
        )
    }
}

//组件和状态关联
const mapStateToProps = state => {
    return {product:state.product};
};
Product = connect(mapStateToProps)(Product);

export default Product;
