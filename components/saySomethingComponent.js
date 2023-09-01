import { useContext, useLayoutEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal, Animated, TextInput, Image, ActivityIndicator, FlatList, ToastAndroid} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';  
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MainConSocketContext } from "../App";
import Hyperlink from 'react-native-hyperlink'
import { authx } from "../db/firebase";
import JWT from 'expo-jwt';
import ip from "../constants";
import { useSelector } from "react-redux";
import WebView from "react-native-webview";

const {width, height} = Dimensions.get("window")

export default function SaySomethingComp(x){

    const [loaded, setLoaded] = useState(false)
    const [likedByMe, setLikedByMe] = useState(false)
    const [totalLikes, setTotalLikes] = useState(0)
    const [key, setKey] = useState("")
    const [likesUIDLoaded, setLikesUIDLoaded] = useState(false)
    const [likesModelVisible, setLikesModelVisible] = useState(false)
    const [likesUIDData, setLikesUIDData] = useState()
    const [commentsLoaded, setCommentsLoaded] = useState(false)
    const [commentsModelVisible, setCommentsModelVisible] = useState(false)
    const [commentsData, setCommentsData] = useState([])
    const [text, setText] = useState("")
    const [shareModel, setShareModel] = useState(false)
    const [optionsModel,setOptionsModel] = useState(false)
    const [deletePost, setDeletePost] = useState(null)
    const [disableButtonPress, setdisableButtonPress] = useState(false)
    const [deletionState,setDeletionState] = useState("deleted")
    const [urlModalVis, setUrlModalVis] = useState(false)
    const [hyperUrl, setHyperUrl] = useState("")

    const [commentToDeleteID, setCommentToDeleteID] = useState(null)
    const usersData = useSelector(state => state.usersData)
    const navigationContext = useSelector(state => state.nav)

    useLayoutEffect(()=>{
        if(!loaded){
            setData()
        }
    })

    const mainConSocket = useContext(MainConSocketContext)
    const userProfileContext = usersData

    return(
        <View style={{justifyContent:"center",alignItems:"center", marginTop:20 }}>
            
            {
                (deletionState == "loading") && (
                    <View style={{position:"absolute",justifyContent:"center",alignItems:"center"}} >
                        <ActivityIndicator size="large" color="black" />
                    </View>
                )   
            }
            {
                (deletionState == "deleted") && (
                    <View style={{position:"absolute",justifyContent:"center",alignItems:"center"}} >
                        <Text style={{color:"red",fontSize:15}}>Deleted Post</Text>
                    </View>
                )
            }
            {
                (deletionState == "error") && (
                    <View style={{position:"absolute",justifyContent:"center",alignItems:"center"}} >
                        <Text style={{color:"red",fontSize:15}}>Oops! An Error Occured</Text>
                    </View>
                )
            }

                <View style={{opacity : (optionsModel == false && deletePost == x.data.postID && deletePost != null) ? 0.25 : 1}} >
                    {
                        x.data.postType == "share" && (
                                <View  style={{height:height/11.3, width:width/1.23, backgroundColor:"#eff7b0", borderTopLeftRadius:26, borderTopRightRadius:26, top:20}}>
                                    <View style={{marginLeft:width/27, marginTop:height/59, flexDirection:"row", bottom:4}} >
                                            <TouchableOpacity disabled={disableButtonPress} onPress={()=> jump(x.data.userData.uid, x.data.userData.userName)} >
                                                <Image 
                                                    source={{uri:x.data.userData.avatar}}
                                                    style={{height:height/25, width:width/13, borderRadius:900}}
                                                />
                                            </TouchableOpacity>
                                            <View style={{justifyContent:"center", marginLeft:5}} >
                                                <Text style={{fontWeight:"bold", fontSize:13, color:"grey"}}>{x.data.userData.userName}<Text style={{fontWeight:"normal", fontStyle:"italic"}}> shared</Text></Text>
                                            </View>
                                            {
                                                ( x.data.userData.uid == authx.currentUser.uid ) && (
                                                    <TouchableOpacity style={{justifyContent:"center",alignItems:"flex-end", marginRight:15, flex:1}} onPress={()=>{setOptionsModel(true), setDeletePost(x.data.postID)}} disabled={disableButtonPress} >
                                                        <Entypo name="dots-three-vertical" size={13} color="grey" />
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </View>
                                </View>
                        )
                    }
                    

                    <View style={{opacity : (optionsModel == false && ( x.data.postType == "share" ? deletePost == x.data.sharedPostData._id : deletePost == x.data._id ) && deletePost != null) ? 0.25 : 1}} >
                        <View style={{minHeight:height/7.5, width:width/1.23, backgroundColor:"white", borderTopLeftRadius:26, borderTopRightRadius:26, elevation:3, borderLeftColor:"grey",borderLeftWidth:0.3, borderRightColor:"grey",borderRightWidth:0.3}}>
                            <View style={{marginLeft:width/27, marginTop:height/59, flexDirection:"row"}} >
                                <TouchableOpacity disabled={disableButtonPress} onPress={()=>{jump(x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid, x.data.postType == "share" ? x.data.postUserData.userName : x.data.userData.userName)}}>    
                                    <Image 
                                        source={{uri: x.data.postType == "share" ? x.data.postUserData.avatar : x.data.userData.avatar }}
                                        style={{height:height/23, width:width/11.7, borderRadius:900}}
                                    />
                                </TouchableOpacity>
                                <View style={{justifyContent:"center", marginLeft:5}} >
                                    <Text style={{fontWeight:"bold", fontSize:13.3, color:"grey"}}>{x.data.postType == "share" ? x.data.postUserData.userName : x.data.userData.userName }</Text>
                                </View>
                                <View style={{justifyContent:"center", alignItems:"flex-end", flex:1, marginRight:15}} >
                                    <Text style={{fontWeight:"bold", fontSize:11, color:"darkgrey"}}>{x.data.creationMessage}</Text>
                                </View>
                                {
                                    ( x.data.postType == "share" ? x.data.postUserData.uid == authx.currentUser.uid : x.data.userData.uid == authx.currentUser.uid ) && (
                                        <TouchableOpacity style={{justifyContent:"center",alignItems:"flex-end", marginRight:15}} onPress={()=>{setOptionsModel(true), setDeletePost(x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id)}} disabled={disableButtonPress}>
                                            <Entypo name="dots-three-vertical" size={13} color="lightgrey" />
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                            <View style={{marginHorizontal: width/39, marginVertical:height/100, left:18, top:5, marginRight:width/13, marginBottom:20}} >
                                <Hyperlink linkStyle={ { color: '#2980b9'} } onPress={(url)=>{
                                    setHyperUrl(url)
                                    setUrlModalVis(true)
                                }}>
                                    <Text style={{color:"black", fontWeight:"bold"}}>{x.data.postType == "share" ?  x.data.sharedPostData.text : x.data.text }</Text>
                                </Hyperlink>
                            </View>
                            <View style={{flexDirection:"row"}}>
                                {
                                    totalLikes > 0 && (
                                        <View style={{marginLeft:width/27, marginBottom:5}} >
                                            <TouchableOpacity style={{height:13,width:width/10}} onPress={checkLikes} disabled={disableButtonPress} >
                                                <Text style={{fontSize:9.7, color:"red"}}>
                                                    {totalLikes} Likes
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }

                                {
                                    (x.data.totalComments > 0) && ( 
                                        (totalLikes > 0) ? (
                                            <View style={{marginLeft:5, marginBottom:5}}>
                                                <Text style={{fontSize:9.7, color:"grey"}}>{x.data.totalComments} Comments</Text>
                                            </View>
                                        )
                                        :
                                        (
                                            <View style={{marginLeft:width/27, marginBottom:5}} >
                                                <Text style={{fontSize:9.7, color:"grey"}}>{x.data.totalComments} Comments</Text>
                                            </View>
                                        )
                                    )
                                    
                                }
                                
                            </View>
                        </View>
                        <View style={{height:height/19, width:width/1.23, backgroundColor:"white", borderBottomLeftRadius:26, borderBottomRightRadius:26, elevation:1.5, borderBottomColor:"grey", borderBottomWidth:0.5, justifyContent:"space-evenly", alignItems:"center", flexDirection:"row"}}>
                            <TouchableOpacity onPress={clickLike} disabled={disableButtonPress} >
                                <FontAwesome name="heart-o" size={17} color="grey" />
                                {
                                    likedByMe && (
                                        <FontAwesome name="heart" size={17} color="red" style={{position:"absolute"}} />
                                    )
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={checkComments} disabled={disableButtonPress} >
                                <EvilIcons name="comment" size={25} color="grey" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setShareModel(true)}} disabled={disableButtonPress} >
                                <Entypo name="feather" size={17} color="grey" />
                            </TouchableOpacity>
                        </View>
                    </View>
                
                
                
                <Modal visible={likesModelVisible} transparent animationType="slide" >
                    <View style={{flex:1, backgroundColor:"rgba(9,9,0,0.85)", alignItems:"center", justifyContent:"flex-end"}}>
                        <View style={{backgroundColor:"white", height:height/1.1, width:width/1.03, borderTopRightRadius:13, borderTopLeftRadius:13}}>
                            
                            <View style={{flexDirection:"row"}} >
                                <TouchableOpacity style={{marginTop:height/33, marginLeft:width/25}} onPress={goBack} >
                                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                                </TouchableOpacity>
                                <View style={{marginTop:height/32, marginRight:15, alignItems:"flex-end", flex:1, }} >
                                    <Text style={{fontWeight:"bold", fontSize:15}}>Likes</Text>
                                </View>
                            </View>

                            {
                                (likesUIDLoaded == false || likesUIDData == null) ? (
                                    <View style={{backgroundColor:"white", alignItems:"center", justifyContent:"center", marginTop:height/2.7}}>
                                        <ActivityIndicator size="large" color="black" />
                                    </View>
                                )
                                :
                                (
                                    <View style={{justifyContent:"center", alignItems:"center", marginTop:height/25}} >
                                        <FlatList 
                                            data={likesUIDData}
                                            showsVerticalScrollIndicator={true}
                                            renderItem={({item}) => {
                                                return ( 
                                                        <UserComp 
                                                            image={item.avatar}
                                                            insignia={item.userInsignia}
                                                            userName = {item.userName}
                                                            standPoint = {item.standPoint}
                                                            uid={item.uid}
                                                        />
                                                )
                                            }}
                                            keyExtractor={(item, index) => { return(index.toString())}} 
                                        />
                                    </View>
                                )
                            }
                    
                        </View>
                    </View>
                </Modal>


                <Modal visible={commentsModelVisible} transparent animationType="slide">
                    <View style={{flex:1, backgroundColor:"rgba(9,9,0,0.85)", alignItems:"center", justifyContent:"flex-end"}}>
                        <View style={{backgroundColor:"white", height:height/1.02, width:width/1.03, borderTopRightRadius:13, borderTopLeftRadius:13}}>
                            <View style={{flexDirection:"row"}} >
                                <TouchableOpacity style={{marginTop:height/33, marginLeft:width/25}} onPress={goBack} >
                                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                                </TouchableOpacity>
                                <View style={{marginTop:height/32, marginRight:15, alignItems:"flex-end", flex:1, }} >
                                    <Text style={{fontWeight:"bold", fontSize:15}}>Comments</Text>
                                </View>
                            </View>
                            
                            {
                                commentToDeleteID != null && (
                                    <View style={{width:"100%", height:30, backgroundColor:"rgba(190,190,50,0.55)", flexDirection:"row", marginTop:15}}>
                                        <View style={{justifyContent:"center", marginLeft:width/25}}>
                                            <TouchableOpacity onPress={()=>{setCommentToDeleteID(null)}} >
                                                <Entypo name="cross" size={21} color="grey" />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{alignItems:"flex-end", flex:1, marginRight:10, justifyContent:"center"}}>
                                            <TouchableOpacity onPress={deleteComment} >
                                                <MaterialIcons name="delete-outline" size={21} color="grey" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }


                            {
                                commentsLoaded == false || commentsData == null ? (
                                    <View style={{backgroundColor:"white", alignItems:"center", justifyContent:"center", marginTop:height/2.7}}>
                                        <ActivityIndicator size="large" color="black" />
                                    </View>
                                ) : 
                                commentsData.length == 0 ? (
                                    <View style={{flex:1}} >
                                        <View style={{backgroundColor:"white", alignItems:"center", justifyContent:"center", marginTop:height/2.7}}>
                                            <EvilIcons name="comment" size={41} color="grey" />
                                        </View>
                                        <View style={{marginBottom:15, flexDirection:"row", alignItems:"flex-end", flex:1, justifyContent:"center"}} >
                                            <TextInput 
                                                    placeholder="Comment On Post"
                                                    multiline
                                                    value={text}
                                                    onChangeText={changeCommentText}
                                                    style={{borderColor:"grey",borderWidth:1, height:40, width:width/1.4, borderRadius:27, paddingHorizontal:13, paddingVertical:6}}
                                                />
                                            <TouchableOpacity style={{width:width/6,backgroundColor:"yellow",borderRadius:20, marginLeft:10, justifyContent:"center",alignItems:"center", height:height/19}} onPress={postComment} >
                                                    <AntDesign name="arrowright" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    
                                )
                                :
                                (
                                    <View style={{marginTop:height/17, marginHorizontal:width/33, flex:1}} >
                                        <FlatList 
                                            data={commentsData}
                                            showsVerticalScrollIndicator={true}
                                            renderItem={({item}) => {
                                                return ( 
                                                        <CommentComponent 
                                                            image={item.userData.avatar}
                                                            insignia={item.userData.userInsignia}
                                                            userName = {item.userData.userName}
                                                            uid={item.userData.uid}
                                                            comment={item.comment}
                                                            creationMessage={item.creationMessage}
                                                            totalLikes={item.totalLikes}
                                                            likedByMe={item.likedByMe}
                                                            commentID={item.commentID}
                                                            actualComment={item}
                                                        />
                                                )
                                            }}
                                            keyExtractor={(item, index) => { return(index.toString())}} 
                                        />
                                        <View style={{marginBottom:15, flexDirection:"row"}} >
                                            <TextInput 
                                                    placeholder="Comment On Post"
                                                    multiline
                                                    value={text}
                                                    onChangeText={changeCommentText}
                                                    style={{borderColor:"grey",borderWidth:1, height:40, width:width/1.4, borderRadius:27, paddingHorizontal:13, paddingVertical:6}}
                                                />
                                            <TouchableOpacity style={{width:width/6,backgroundColor:"yellow",borderRadius:20, marginLeft:10, justifyContent:"center",alignItems:"center"}} onPress={postComment} >
                                                    <AntDesign name="arrowright" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }

                        </View>
                    </View>
                </Modal>
            
                <Modal visible={shareModel} transparent >
                    <View style={{flex:1, backgroundColor:"rgba(9,9,0,0.85)", alignItems:"center", justifyContent:"center", height:100}}>
                        <View style={{minHeight:height/6, width:width/1.23, backgroundColor:"white", borderRadius:26, elevation:3, borderLeftColor:"grey",borderLeftWidth:0.3, borderRightColor:"grey",borderRightWidth:0.3}}>
                            <View style={{marginLeft:width/27, marginTop:height/59, flexDirection:"row"}} >
                                <TouchableOpacity>    
                                    <Image 
                                        source={{uri: x.data.postType == "share" ? x.data.postUserData.avatar : x.data.userData.avatar }}
                                        style={{height:height/23, width:width/11.7, borderRadius:900}}
                                    />
                                </TouchableOpacity>
                                <View style={{justifyContent:"center", marginLeft:5}} >
                                    <Text style={{fontWeight:"bold", fontSize:13.3, color:"grey"}}>{x.data.postType == "share" ? x.data.postUserData.userName : x.data.userData.userName }</Text>
                                </View>
                                <View style={{justifyContent:"center", alignItems:"flex-end", flex:1, marginRight:15}} >
                                    <Text style={{fontWeight:"bold", fontSize:11, color:"darkgrey"}}>{x.data.creationMessage}</Text>
                                </View>
                            </View>
                            <View style={{marginHorizontal: width/39, marginVertical:height/100, left:18, top:5, marginRight:width/13, marginBottom:20}} >
                                <Text style={{color:"black", fontWeight:"bold"}}>{x.data.postType == "share" ?  x.data.sharedPostData.text : x.data.text }</Text>
                            </View>
                            <View style={{flexDirection:"row"}}>
                                {
                                    totalLikes > 0 && (
                                        <View style={{marginLeft:width/27, marginBottom:5}} >
                                            <TouchableOpacity style={{height:13,width:width/10}}>
                                                <Text style={{fontSize:9.7, color:"red"}}>
                                                    {totalLikes} Likes
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }

                                {
                                    (x.data.totalComments > 0) && ( 
                                        (totalLikes > 0) ? (
                                            <View style={{marginLeft:5, marginBottom:5}}>
                                                <Text style={{fontSize:9.7, color:"grey"}}>{x.data.totalComments} Comments</Text>
                                            </View>
                                        )
                                        :
                                        (
                                            <View style={{marginLeft:width/27, marginBottom:5}} >
                                                <Text style={{fontSize:9.7, color:"grey"}}>{x.data.totalComments} Comments</Text>
                                            </View>
                                        )
                                    )
                                    
                                }
                                
                            </View>
                        </View>
                        <View style={{marginTop:height/27, marginLeft:width/2.7, flexDirection:"row"}} >
                            <TouchableOpacity style={{height:height/23, width:width/5.5, backgroundColor:"transparent", justifyContent:"center",alignItems:"center", borderColor:"white", borderWidth:1, borderRadius:17}} onPress={()=>{setShareModel(false)}} >
                                <Text style={{color:"white", fontWeight:"bold"}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{height:height/23, width:width/5.5, backgroundColor:"yellow", justifyContent:"center",alignItems:"center", marginLeft:20, borderRadius:17}} onPress={clickShare} >
                                <Text style={{color:"black", fontWeight:"bold"}}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                <Modal visible={optionsModel} transparent>
                    <View style={{backgroundColor:"rgba(9,9,0,0.08)", flex:1, alignItems:"center", justifyContent:"center", height:100}}>
                            <View style={{height:height/5,width:width/1.7, backgroundColor:"white", borderRadius:20}} >
                                <TouchableOpacity style={{alignItems:"center", marginTop:30, borderColor:"lightgrey", borderBottomWidth:0.3, borderTopWidth:0.3, padding:11}} onPress={deletePostFunc}>
                                    <Text style={{color:"red"}}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{alignItems:"center", marginTop:0, borderColor:"lightgrey", borderBottomWidth:0.7, padding:11}} onPress={()=>{setOptionsModel(false), setDeletePost(null)}}>
                                    <Text style={{color:"grey"}}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                </Modal>

                <Modal visible={urlModalVis} animationType="slide" onRequestClose={()=>{setUrlModalVis(false)}} >
                    <View style={{flexDirection:"row"}}>
                        <TouchableOpacity style={{height:50, width:50, backgroundColor:"white", marginLeft:10, marginTop:15, borderRadius:30, borderBottomColor:"grey", borderWidth:1, justifyContent:"center", alignItems:"center", marginBottom:10}} onPress={()=>{setUrlModalVis(false)}}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <View style={{marginTop:25, flex:1, alignItems:"flex-end", marginRight:15}}>
                            <Text style={{fontSize:19}}>RAYE</Text>
                        </View>
                    </View>
                    <WebView  
                        source={{ uri: hyperUrl }}
                        renderLoading={()=>{
                                return(
                                    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                                        <ActivityIndicator size="large" color="black" />
                                    </View>
                                )
                        }}
                        renderError={()=>{
                            return(
                                <View style={{height:"100%", backgroundColor:"white", justifyContent:"center",alignItems:"center"}} >
                                    <Foundation name="page-delete" size={35} color="grey" />
                                    <Text style={{color:"grey", fontSize:17, marginVertical:15, fontWeight:"bold"}}>Unable to load at the moment</Text>
                                    <Text style={{color:"grey", fontSize:11.5}}>Try Checking your Network Connection</Text>
                                </View>
                            )
                        }}
                        startInLoadingState
                    />
                </Modal>
                
            </View>
      </View>
    )
    
    function UserComp(y){
        return(
            <View style={{}} >
                <View style={{flexDirection:"row", marginHorizontal:width/23, marginVertical:height/57}}>
                    <View style={{backgroundColor:"#D8D7D6", width:width/5, height:height/10, position:"absolute", borderRadius:1000}} />
                        <TouchableOpacity style={{height:height/10,width:width/5, borderRadius:1000}} onPress={()=>{jump(y.uid,y.userName)}} >
                            <Image source={{uri:y.image}} style={{height:height/10,width:width/5, borderRadius:1000}} />
                        </TouchableOpacity>
                        <View style={{justifyContent:"center", paddingLeft:15 }}>
                            <Text style={{fontSize:17}}>{y.insignia}</Text>
                            <Text style={{fontSize:11, color:"grey"}}>{y.userName}</Text>
                        </View>
                        {
                            y.uid != authx.currentUser.uid && (
                            <View style={{marginHorizontal:12, flexDirection:"row", alignItems:"center", width:width/2.5}} >
                                <View style={{height:height/21, width:3, backgroundColor:"black", marginRight:15}} />
                                <Text style={{fontStyle:"italic",fontSize:12, fontWeight:"bold",}}>" {y.standPoint} "</Text>
                            </View>
                            )
                        }
                </View>
                <View style={{width:width/2, height:0.5, backgroundColor:"lightgrey", elevation:2, marginLeft:15, marginLeft:width/3.5}} />
           </View>
        )
    
    }

    function CommentComponent(z){

        const [commentLikedByMe, setCommentLikedByMe] = useState(false)
        const [commentLoaded, setCommentLoaded] = useState(false)
        const [totalCommentLikes, setTotalCommentLikes] = useState(0)

        useLayoutEffect(()=>{
            if(commentLoaded == false){
                setCommentLikedByMe(z.likedByMe)
                setCommentLoaded(true)
                setTotalCommentLikes(z.totalLikes)
            }
        })

        return(
            <View style={{marginVertical:11}}>
                <View style={  z.commentID == commentToDeleteID ? {flexDirection:"row", width:"100%", backgroundColor:"rgba(190,190,50,0.55)"} : {flexDirection:"row"} } > 
                    <TouchableOpacity style={{marginRight:10}} onPress={()=>{jump(z.uid, z.insignia)}} >
                        <Image 
                            source={{uri:z.image}} 
                            style={{height:height/27, width:width/14.7, borderRadius:200}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:"white", minWidth:width/1.7, minHeight:height/19, maxWidth:width/1.25,borderTopRightRadius:10, borderBottomLeftRadius:10, borderBottomRightRadius:10, elevation:0.7}} disabled={z.uid == authx.currentUser.uid ? false : true} onLongPress={()=>{setCommentToDeleteID(z.commentID)}} >
                        <View style={{marginTop:3.5, marginLeft:10}}>
                            <Text> 
                                <TouchableOpacity onPress={()=>{jump(z.uid, z.insignia)}}>
                                    <Text style={{fontSize:11.7, fontWeight:"bold", color:"grey"}}>{z.userName}</Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                   
                        <View style={{marginBottom:7, marginLeft:10, marginRight:17, maxWidth:width/1.3}} >
                            <Text style={{fontSize:13, fontWeight:"bold"}}>{z.comment}</Text>
                        </View>
                        
                        <View style={{justifyContent:"flex-end", marginVertical:5, marginHorizontal:10, flexDirection:"row"}} >
                            <View style={{flex:1, alignItems:"center", flexDirection:"row"}} >
                                <Text style={{color:"grey", fontSize:11}}>{z.creationMessage}</Text>
                                <Text style={{color:"grey", fontSize:11, marginLeft:20, marginTop:1}}>{totalCommentLikes} Like</Text>
                            </View>
                            <TouchableOpacity onPress={clickCommentLike} >
                                <FontAwesome name="heart-o" size={15} color="grey" />
                                {
                                    commentLikedByMe && (
                                        <FontAwesome name="heart" size={15} color="red" style={{position:"absolute"}} />
                                    )
                                }
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    
        
    
        function clickCommentLike(){

            let changeCommentIndex = commentsData.indexOf(z.actualComment)
            
            if(commentLikedByMe == false){
                commentsData[changeCommentIndex].likedByMe = true
                commentsData[changeCommentIndex].totalLikes = commentsData[changeCommentIndex].totalLikes + 1
                setTotalCommentLikes(x=>x+1)
                setCommentLikedByMe(true)
                if(z.commentID != "noID"){
                    mainConSocket.emit("likeUnlikeComment", key,
                                        x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid,
                                        x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id,
                                        z.commentID,
                                        "like"
                                        )
                }
            }
            else{
                commentsData[changeCommentIndex].likedByMe = false
                commentsData[changeCommentIndex].totalLikes = commentsData[changeCommentIndex].totalLikes - 1 
                setTotalCommentLikes(x=>x-1)
                setCommentLikedByMe(false)
                if(z.commentID != "noID"){
                    mainConSocket.emit("likeUnlikeComment", key,
                                        x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid,
                                        x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id,
                                        z.commentID,
                                        "unlike"
                                        )
                }
            }
        }
    
    
    
    
    }

    function jump(uid,name) {   //same user ki UID and UserName
        if(uid != authx.currentUser.uid){
            setLikesModelVisible(false)
            setCommentsModelVisible(false)
            navigationContext.navigate("chattersProfile",{user:name, uid:uid})
        }
    }


   
    function setData(){
        const token = JWT.encode(authx.currentUser.uid, "secretKey");
        setLikedByMe(x.data.likedByMe)
        setTotalLikes(x.data.totalLikes)
        setKey(token)
        setLoaded(true)
    }

    function clickLike(){
        if(likedByMe == false){
            mainConSocket.emit("likeUnlikePost", key,
                                x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid,
                                x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id,
                                "like"
                                )
            setLikedByMe(true)
            setTotalLikes(x => x+1)
        } 
        else{
            mainConSocket.emit("likeUnlikePost", key,
                                x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid,
                                x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id,
                                "unLike"
                                )
            setLikedByMe(false)
            setTotalLikes(x => x-1)
        }
    }

    function clickShare(){
        const key2 = JWT.encode({meuid:authx.currentUser.uid,
                                useruid: x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid
                                }, "secretKey");
        mainConSocket.emit("share",key2, 
                            x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id,
                            )
        ToastAndroid.show(
            "Raye Shared",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        )
        setShareModel(false)
    }

    async function checkLikes(){
        setLikesModelVisible(true)
        if(likesUIDLoaded == false){
            const data = await (await fetch(ip+":8010/getPostLikes", { 
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userUID : x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid,
                    postID : x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id
                })
            })).json()
            data;
            setLikesUIDData(data)
            setLikesUIDLoaded(true)
            console.log(data)
        }
    }


    function goBack(){
        setLikesModelVisible(false)
        setCommentsModelVisible(false)
    }

    async function checkComments(){
        setCommentsModelVisible(true)
        if(commentsLoaded ==  false){
            const data = await (await fetch(ip+":8010/getPostComments", { 
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key : key,
                    userUID : x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid,
                    postID : x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id
                })
            })).json()
            data;
            setCommentsData(data)
            setCommentsLoaded(true)
            console.log(data)
        }
    }

    function changeCommentText(x){
        setText(x)
    }

    function postComment(){
        if(text.length > 0){
            mainConSocket.emit("addComment", key, text,
                                x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid,
                                x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id
                                )
            setCommentsData(x => [...x,{
                userData : {
                    avatar:userProfileContext.avatar,
                    userName: userProfileContext.userName,
                    userInsignia : userProfileContext.userInsignia,
                    uid:userProfileContext.uid
                },
                comment : text,
                creationMessage : "Now",
                totalLikes:0,
                likedByMe:false,
                commentID:"noID"
            }])
            setText("")
        }
    }

    function deleteComment(){
        if(commentToDeleteID != "noID"){
            mainConSocket.emit("deleteComment", key, 
                                x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid,
                                x.data.postType == "share" ? x.data.sharedPostData._id : x.data._id,
                                commentToDeleteID
                                )
        }
        let comments = commentsData
        const index = commentsData.indexOf(commentToDeleteID)
        comments.splice(index,1)
        setCommentsData(comments)
        setCommentToDeleteID(null)
    }

    async function deletePostFunc(){
        setdisableButtonPress(true)
        setOptionsModel(false)
        setDeletionState("loading")
        try{
            const data = await (await fetch(ip+":8009/deletePost", { 
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key : key,
                    postID : deletePost
                })
            })).json()
            data;
            if(data == "success"){
                setDeletionState("deleted")
            }
            else{
                setDeletionState("error")
            }
        }
        catch(e){
            console.warn(e)
        }
    }

}
