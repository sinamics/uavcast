// import React, { useState } from 'react';
// import { connect } from 'react-redux';
// import { Player } from '../../../camera/components/WSAvcPlayer';
// import { ResizableBox } from 'react-resizable';
// import Draggable from 'react-draggable';
// import 'react-resizable/css/styles.css';

// // resize video initial state
// const initialState = { width: 264, height: 148 };

// const MavVideo = (props) => {
//   const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
//   const [resize, setResize] = useState(initialState);

//   return (
//     <Draggable position={dragPos} onStop={(e, d) => setDragPos({ x: d.x, y: d.y })} allowAnyClick handle="strong">
//       <div className="mav_map_video">
//         <ResizableBox
//           width={resize.width}
//           height={resize.height}
//           minConstraints={[264, 148]}
//           maxConstraints={[900, 500]}
//           lockAspectRatio={true}
//           resizeHandles={['se']}
//           onResize={(event, { element, size, handle }) => setResize({ width: size.width, height: size.height })}
//         >
//           <Player
//             className="handle"
//             {...props}
//             setResize={() => setResize(initialState)}
//             setDragPos={() => setDragPos({ x: 0, y: 0 })}
//           />
//         </ResizableBox>
//       </div>
//     </Draggable>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     video_fetching: state.Server.video_fetching,
//   };
// };
// export default connect(mapStateToProps)(MavVideo);
