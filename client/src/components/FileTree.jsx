/* eslint-disable react/prop-types */

const FileTreeNode = ({ filename, nodes, onSelect, path }) => {
    const isDir = !!nodes;
    return (
        <div onClick={(e) => {
            e.stopPropagation();
            if(isDir) return;
            onSelect(path);
        }} className="ml-4">
            <p className={`${isDir ? '' : 'cursor-pointer'}  `}>
            {isDir && "📂 "} 
            {filename}
            </p>
            {nodes && 
                <ul>
                    {filename != "node modules" && Object.keys(nodes).map(child => (
                        <li key={child} className="leading-relaxed">
                            <FileTreeNode 
                                path={path + "/" + child} 
                                filename={child} 
                                nodes={nodes[child]} 
                                onSelect={onSelect}
                            />
                        </li>
                    ))}
                </ul>}
        </div>
    );
}

const FileTree = ({ tree, onSelect }) => {
    return (
        <FileTreeNode 
            filename={"/"}
            nodes={tree}
            path=""
            onSelect={onSelect}
        />
    );
}

export default FileTree