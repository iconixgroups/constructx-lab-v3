import React, { useState } from "react";
import { Tree, TreeItem, TreeItemLayout, TreeOpenChangeData, TreeOpenChangeEvent } from "@fluentui/react-components/unstable";
import { FolderRegular, FolderOpenRegular, FolderAddRegular, EditRegular, DeleteRegular } from "@fluentui/react-icons";
import { Button } from "./ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";

// Helper function to build the tree structure from a flat list of folders
const buildTree = (folders, parentId = null) => {
    return folders
        .filter(folder => folder.parentFolderId === parentId)
        .map(folder => ({
            id: folder.id,
            name: folder.name,
            children: buildTree(folders, folder.id),
        }));
};

// Recursive component to render tree items
const RenderTreeItem = ({ node, selectedFolderId, onSelectFolder, onContextMenuAction }) => {
    const isSelected = node.id === selectedFolderId;

    const handleContextMenu = (action, folderId, folderName) => {
        onContextMenuAction(action, folderId, folderName);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <TreeItem 
                    itemType={node.children && node.children.length > 0 ? "branch" : "leaf"} 
                    value={node.id}
                    className={`rounded-md ${isSelected ? "bg-muted font-semibold" : "hover:bg-muted/50"}`}
                >
                    <TreeItemLayout 
                        iconBefore={node.children && node.children.length > 0 ? <FolderRegular /> : <FolderRegular />} // Use FolderOpenRegular based on open state if needed
                        onClick={() => onSelectFolder(node.id)} // Select on click
                        className="cursor-pointer"
                    >
                        {node.name}
                    </TreeItemLayout>
                    {node.children && node.children.length > 0 && (
                        <Tree>
                            {node.children.map(childNode => (
                                <RenderTreeItem 
                                    key={childNode.id} 
                                    node={childNode} 
                                    selectedFolderId={selectedFolderId}
                                    onSelectFolder={onSelectFolder}
                                    onContextMenuAction={onContextMenuAction}
                                />
                            ))}
                        </Tree>
                    )}
                </TreeItem>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => handleContextMenu("create", node.id, node.name)}>
                    <FolderAddRegular className="mr-2 h-4 w-4" /> Create Subfolder
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextMenu("rename", node.id, node.name)}>
                    <EditRegular className="mr-2 h-4 w-4" /> Rename Folder
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextMenu("delete", node.id, node.name)} className="text-destructive">
                    <DeleteRegular className="mr-2 h-4 w-4" /> Delete Folder
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

const FolderTree = ({ folders, selectedFolderId, onSelectFolder, onFolderCreated, onFolderDeleted, onFolderRenamed }) => {
    const [openItems, setOpenItems] = useState([]);
    const treeData = buildTree(folders);

    const handleOpenChange = (event: TreeOpenChangeEvent, data: TreeOpenChangeData) => {
        setOpenItems(data.openItems);
    };

    const handleContextMenuAction = (action, folderId, folderName) => {
        console.log(`Context menu action: ${action} on folder ${folderId} (${folderName})`);
        // Implement logic based on action
        if (action === "create") {
            // Open create folder modal/form, passing folderId as parent
            alert(`Trigger create subfolder under: ${folderName}`);
            // Example: openCreateFolderModal(folderId);
        } else if (action === "rename") {
            // Open rename folder modal/form
            const newName = prompt(`Enter new name for folder "${folderName}":`, folderName);
            if (newName && newName !== folderName) {
                // Call API to rename
                console.log(`Renaming ${folderId} to ${newName}`);
                // mockApi.renameFolder(folderId, newName).then(onFolderRenamed);
                alert("Rename functionality placeholder.");
            }
        } else if (action === "delete") {
            // Confirm deletion
            if (window.confirm(`Are you sure you want to delete folder "${folderName}"? This might delete its contents.`)) {
                // Call API to delete
                console.log(`Deleting folder ${folderId}`);
                // mockApi.deleteFolder(folderId).then(onFolderDeleted);
                alert("Delete functionality placeholder.");
            }
        }
    };

    return (
        <div className="space-y-2">
            {/* Root level selection */}
            <Button 
                variant={selectedFolderId === null ? "secondary" : "ghost"} 
                className="w-full justify-start h-8 px-2 text-left" 
                onClick={() => onSelectFolder(null)}
            >
                 <FolderRegular className="mr-2 h-4 w-4" /> Project Root
            </Button>
            {/* Tree View */}
            <Tree 
                aria-label="Project Folders" 
                openItems={openItems} 
                onOpenChange={handleOpenChange}
            >
                {treeData.map(node => (
                    <RenderTreeItem 
                        key={node.id} 
                        node={node} 
                        selectedFolderId={selectedFolderId}
                        onSelectFolder={onSelectFolder}
                        onContextMenuAction={handleContextMenuAction}
                    />
                ))}
            </Tree>
        </div>
    );
};

export default FolderTree;

