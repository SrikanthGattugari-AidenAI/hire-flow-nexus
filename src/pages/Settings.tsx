
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { users } from "@/data/mockData";

const Settings = () => {
  const { toast } = useToast();
  const currentUser = users[0]; // Default to first user for demo
  
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    bio: "HR Manager with 8+ years of experience in tech recruitment. Passionate about finding the best talent and creating a great hiring experience.",
    timezone: "America/Los_Angeles",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewApplications: true,
    emailInterviewScheduled: true,
    emailStatusChange: true,
    emailMessages: false,
    pushNewApplications: true,
    pushInterviewScheduled: true,
    pushStatusChange: false,
    pushMessages: true,
  });
  
  const [companySettings, setCompanySettings] = useState({
    companyName: "TechCorp",
    website: "https://techcorp.example.com",
    industry: "Technology",
    size: "101-500",
    description: "TechCorp is a leading technology company specializing in innovative software solutions for businesses of all sizes. Our mission is to simplify complex processes and help organizations succeed in the digital age.",
  });
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully.",
    });
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved successfully.",
    });
  };
  
  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Company settings updated",
      description: "Company information has been updated successfully.",
    });
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Templates</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <form onSubmit={handleProfileSubmit}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profileForm.role}
                        onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={profileForm.timezone}
                        onValueChange={(value) => setProfileForm({ ...profileForm, timezone: value })}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description about yourself and your role in the hiring process.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex gap-2">
                      <Input
                        id="password"
                        type="password"
                        value="••••••••••"
                        disabled
                      />
                      <Button type="button" variant="outline">
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Update your profile picture
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex justify-center gap-2 mt-4">
                  <Button type="button" variant="outline" size="sm">
                    Remove
                  </Button>
                  <Button type="button" size="sm">
                    Upload
                  </Button>
                </div>
              </CardContent>
              
              <CardFooter>
                <p className="text-xs text-center text-muted-foreground w-full">
                  Accepted formats: JPG, PNG. Max size: 5MB
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handleNotificationsSubmit}>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control which notifications you receive and how
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Applications</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new candidates apply
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNewApplications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailNewApplications: checked,
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Interview Scheduled</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when interviews are scheduled
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailInterviewScheduled}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailInterviewScheduled: checked,
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Status Changes</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when candidate status changes
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailStatusChange}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailStatusChange: checked,
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you receive messages
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailMessages}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailMessages: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Applications</p>
                          <p className="text-sm text-muted-foreground">
                            Get push notifications for new applications
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNewApplications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushNewApplications: checked,
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Interview Scheduled</p>
                          <p className="text-sm text-muted-foreground">
                            Get push notifications for scheduled interviews
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushInterviewScheduled}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushInterviewScheduled: checked,
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Status Changes</p>
                          <p className="text-sm text-muted-foreground">
                            Get push notifications for candidate status changes
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushStatusChange}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushStatusChange: checked,
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">
                            Get push notifications for new messages
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushMessages}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushMessages: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button type="submit">Save Preferences</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <form onSubmit={handleCompanySubmit}>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details and information
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companySettings.companyName}
                      onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={companySettings.industry}
                      onValueChange={(value) => setCompanySettings({ ...companySettings, industry: value })}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Select
                      value={companySettings.size}
                      onValueChange={(value) => setCompanySettings({ ...companySettings, size: value })}
                    >
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-100">51-100 employees</SelectItem>
                        <SelectItem value="101-500">101-500 employees</SelectItem>
                        <SelectItem value="501+">501+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={companySettings.description}
                    onChange={(e) => setCompanySettings({ ...companySettings, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <span className="text-lg font-bold">T</span>
                    </div>
                    <Button type="button" variant="outline">
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Management</CardTitle>
                <CardDescription>
                  Manage your organization's departments
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">Engineering</p>
                      <p className="text-sm text-muted-foreground">3 active jobs</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">Marketing</p>
                      <p className="text-sm text-muted-foreground">2 active jobs</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">Finance</p>
                      <p className="text-sm text-muted-foreground">1 active job</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Department
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Interview Panel Management</CardTitle>
                <CardDescription>
                  Manage your organization's interview panels
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">Engineering Panel</p>
                      <p className="text-sm text-muted-foreground">3 members</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">Product Panel</p>
                      <p className="text-sm text-muted-foreground">2 members</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">Marketing Panel</p>
                      <p className="text-sm text-muted-foreground">2 members</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Panel
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Workflow Templates */}
        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                Customize recruitment workflows for different job types
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Standard Recruitment</h3>
                    <Badge>Default</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-4">
                    <div className="min-w-[150px] p-3 bg-blue-500 text-white rounded">
                      New
                    </div>
                    <div className="min-w-[150px] p-3 bg-purple-500 text-white rounded">
                      Screening
                    </div>
                    <div className="min-w-[150px] p-3 bg-indigo-500 text-white rounded">
                      Interview
                    </div>
                    <div className="min-w-[150px] p-3 bg-teal-500 text-white rounded">
                      Assessment
                    </div>
                    <div className="min-w-[150px] p-3 bg-pink-500 text-white rounded">
                      Offer
                    </div>
                    <div className="min-w-[150px] p-3 bg-green-500 text-white rounded">
                      Hired
                    </div>
                    <div className="min-w-[150px] p-3 bg-red-500 text-white rounded">
                      Rejected
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Duplicate
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Engineering Recruitment</h3>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-4">
                    <div className="min-w-[150px] p-3 bg-blue-500 text-white rounded">
                      New
                    </div>
                    <div className="min-w-[150px] p-3 bg-purple-500 text-white rounded">
                      Screening
                    </div>
                    <div className="min-w-[150px] p-3 bg-yellow-500 text-white rounded">
                      Technical Test
                    </div>
                    <div className="min-w-[150px] p-3 bg-indigo-500 text-white rounded">
                      First Interview
                    </div>
                    <div className="min-w-[150px] p-3 bg-orange-500 text-white rounded">
                      Technical Interview
                    </div>
                    <div className="min-w-[150px] p-3 bg-pink-500 text-white rounded">
                      Offer
                    </div>
                    <div className="min-w-[150px] p-3 bg-green-500 text-white rounded">
                      Hired
                    </div>
                    <div className="min-w-[150px] p-3 bg-red-500 text-white rounded">
                      Rejected
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Duplicate
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Executive Recruitment</h3>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-4">
                    <div className="min-w-[150px] p-3 bg-blue-500 text-white rounded">
                      New
                    </div>
                    <div className="min-w-[150px] p-3 bg-purple-500 text-white rounded">
                      Screening
                    </div>
                    <div className="min-w-[150px] p-3 bg-cyan-500 text-white rounded">
                      First Interview
                    </div>
                    <div className="min-w-[150px] p-3 bg-indigo-500 text-white rounded">
                      Panel Interview
                    </div>
                    <div className="min-w-[150px] p-3 bg-violet-500 text-white rounded">
                      CEO Interview
                    </div>
                    <div className="min-w-[150px] p-3 bg-pink-500 text-white rounded">
                      Offer
                    </div>
                    <div className="min-w-[150px] p-3 bg-green-500 text-white rounded">
                      Hired
                    </div>
                    <div className="min-w-[150px] p-3 bg-red-500 text-white rounded">
                      Rejected
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Duplicate
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-6">
                <Plus className="h-4 w-4 mr-2" /> Create New Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
