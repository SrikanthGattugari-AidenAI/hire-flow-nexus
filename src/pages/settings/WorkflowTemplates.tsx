
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, MoveVertical, Save } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface StageTemplate {
  id: string;
  name: string;
  color: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  stages: StageTemplate[];
}

const colorOptions = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Teal", value: "bg-teal-500" },
];

const defaultTemplates: WorkflowTemplate[] = [
  {
    id: "1",
    name: "Standard Recruitment",
    description: "A typical recruitment pipeline for most positions",
    stages: [
      { id: "1-1", name: "Applied", color: "bg-blue-500" },
      { id: "1-2", name: "Screening", color: "bg-yellow-500" },
      { id: "1-3", name: "Interview", color: "bg-purple-500" },
      { id: "1-4", name: "Assessment", color: "bg-green-500" },
      { id: "1-5", name: "Offer", color: "bg-pink-500" },
      { id: "1-6", name: "Hired", color: "bg-indigo-500" },
      { id: "1-7", name: "Rejected", color: "bg-red-500" },
    ],
  },
  {
    id: "2",
    name: "Executive Hiring",
    description: "Specialized pipeline for executive positions",
    stages: [
      { id: "2-1", name: "Applied", color: "bg-blue-500" },
      { id: "2-2", name: "Initial Screening", color: "bg-yellow-500" },
      { id: "2-3", name: "First Interview", color: "bg-purple-500" },
      { id: "2-4", name: "Second Interview", color: "bg-teal-500" },
      { id: "2-5", name: "Final Interview", color: "bg-indigo-500" },
      { id: "2-6", name: "Reference Check", color: "bg-green-500" },
      { id: "2-7", name: "Offer", color: "bg-pink-500" },
      { id: "2-8", name: "Hired", color: "bg-indigo-500" },
      { id: "2-9", name: "Rejected", color: "bg-red-500" },
    ],
  },
];

const WorkflowTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(defaultTemplates);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<WorkflowTemplate | null>(null);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("bg-blue-500");

  // Edit or create a template
  const handleEditTemplate = (template: WorkflowTemplate | null) => {
    if (template) {
      // Edit existing template
      setCurrentTemplate({ ...template, stages: [...template.stages] });
      setIsEditingTemplate(true);
    } else {
      // Create new template
      setCurrentTemplate({
        id: `template-${Date.now()}`,
        name: "",
        description: "",
        stages: []
      });
      setIsEditingTemplate(true);
    }
  };

  // Save the template (create or update)
  const handleSaveTemplate = () => {
    if (!currentTemplate) return;

    if (!currentTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (currentTemplate.stages.length === 0) {
      toast({
        title: "Error",
        description: "Template must have at least one stage",
        variant: "destructive",
      });
      return;
    }

    // Check if it's a new template or an update
    const existingTemplateIndex = templates.findIndex(t => t.id === currentTemplate.id);
    
    if (existingTemplateIndex >= 0) {
      // Update existing template
      const newTemplates = [...templates];
      newTemplates[existingTemplateIndex] = currentTemplate;
      setTemplates(newTemplates);
      toast({
        title: "Template updated",
        description: `"${currentTemplate.name}" has been updated.`,
      });
    } else {
      // Add new template
      setTemplates([...templates, currentTemplate]);
      toast({
        title: "Template created",
        description: `"${currentTemplate.name}" has been created.`,
      });
    }
    
    setIsEditingTemplate(false);
    setCurrentTemplate(null);
  };

  // Delete a template
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Template deleted",
      description: "The workflow template has been removed.",
    });
  };

  // Add a stage to current template
  const handleAddStage = () => {
    if (!currentTemplate) return;
    if (!newStageName.trim()) {
      toast({
        title: "Error",
        description: "Stage name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newStage: StageTemplate = {
      id: `${currentTemplate.id}-${Date.now()}`,
      name: newStageName,
      color: newStageColor,
    };

    setCurrentTemplate({
      ...currentTemplate,
      stages: [...currentTemplate.stages, newStage],
    });

    setNewStageName("");
    toast({
      title: "Stage added",
      description: `"${newStageName}" has been added to the template.`,
    });
  };

  // Remove a stage from current template
  const handleRemoveStage = (stageId: string) => {
    if (!currentTemplate) return;

    setCurrentTemplate({
      ...currentTemplate,
      stages: currentTemplate.stages.filter(s => s.id !== stageId),
    });

    toast({
      title: "Stage removed",
      description: "The stage has been removed from the template.",
    });
  };

  // Handle drag and drop of stages
  const handleDragEnd = (result: any) => {
    if (!result.destination || !currentTemplate) return;
    
    const stages = Array.from(currentTemplate.stages);
    const [removed] = stages.splice(result.source.index, 1);
    stages.splice(result.destination.index, 0, removed);
    
    setCurrentTemplate({
      ...currentTemplate,
      stages,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workflow Templates</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              onClick={() => handleEditTemplate(null)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentTemplate?.id.startsWith("template-") ? "Create New Template" : "Edit Template"}</DialogTitle>
              <DialogDescription>
                Create a custom workflow template for your recruitment process.
              </DialogDescription>
            </DialogHeader>
            {currentTemplate && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Template Name</label>
                      <Input
                        value={currentTemplate.name}
                        onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                        placeholder="e.g., Technical Recruitment"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        value={currentTemplate.description}
                        onChange={(e) => setCurrentTemplate({...currentTemplate, description: e.target.value})}
                        placeholder="Brief description of this workflow"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Stages</h3>
                    <div className="text-sm text-muted-foreground">
                      Drag to reorder stages
                    </div>
                  </div>

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="stages">
                      {(provided) => (
                        <div 
                          {...provided.droppableProps}
                          ref={provided.innerRef} 
                          className="space-y-2 min-h-[100px]"
                        >
                          {currentTemplate.stages.length === 0 ? (
                            <div className="text-center py-6 bg-muted/20 border border-dashed rounded-md">
                              <p className="text-muted-foreground">No stages added yet</p>
                            </div>
                          ) : (
                            currentTemplate.stages.map((stage, index) => (
                              <Draggable key={stage.id} draggableId={stage.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center space-x-2 p-2 bg-background border rounded-md"
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab p-1"
                                    >
                                      <MoveVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 flex items-center">
                                      <div className={`w-4 h-4 rounded-full ${stage.color} mr-2`}></div>
                                      <span>{stage.name}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveStage(stage.id)}
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <div className="flex space-x-2">
                    <Input
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      placeholder="New stage name"
                      className="flex-1"
                    />
                    <select 
                      className="px-3 py-2 border rounded-md bg-background text-sm" 
                      value={newStageColor}
                      onChange={(e) => setNewStageColor(e.target.value)}
                    >
                      {colorOptions.map((color) => (
                        <option key={color.value} value={color.value}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    <Button 
                      onClick={handleAddStage}
                      disabled={!newStageName.trim()}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditingTemplate(false);
                setCurrentTemplate(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {templates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-2">No templates created yet</p>
              <Button variant="outline" onClick={() => handleEditTemplate(null)}>
                <Plus className="mr-2 h-4 w-4" /> Create your first template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover-card">
                <CardHeader className="pb-3">
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium mb-2">Workflow Stages</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.stages.map((stage) => (
                        <div 
                          key={stage.id}
                          className="text-xs px-2.5 py-0.5 rounded-full flex items-center"
                          style={{ backgroundColor: stage.color.replace('bg-', 'var(--') + ')', color: 'white' }}
                        >
                          {stage.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowTemplates;
