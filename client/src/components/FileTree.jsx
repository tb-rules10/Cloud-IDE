/* eslint-disable react/prop-types */

const FileTreeNode = ({ filename, nodes }) => {
    const isDir = !!nodes;
    return (
        <div className="ml-4">
            <p className={`${isDir ? '' : 'cursor-pointer'}  `}>
                {filename}
            </p>
            {nodes && 
                <ul>
                    {Object.keys(nodes).map(child => (
                        <li key={child} className="leading-relaxed">
                            <FileTreeNode filename={child} nodes={nodes[child]} />
                        </li>
                    ))}
                </ul>}
        </div>
    );
}

const FileTree = ({ tree }) => {
    return (
        <FileTreeNode 
            filename={"/"}
            nodes={tree}
        />
    );
}

export default FileTree