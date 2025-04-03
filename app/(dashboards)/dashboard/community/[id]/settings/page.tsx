"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Bell, Check, Globe, Lock, Save, SettingsIcon, Shield, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [communitySettings, setCommunitySettings] = useState({
    name: "Photography Club",
    description:
      "A community for photography enthusiasts to share their work, get feedback, and learn from each other.",
    handle: "photographyclub",
    visibility: "public",
    joinType: "open",
    contentVisibility: "members",
    language: "en",
    timezone: "America/New_York",
    categories: ["Photography", "Art", "Education"],
  })

  const [moderationSettings, setModerationSettings] = useState({
    autoModeration: true,
    contentFiltering: "medium",
    newUserRestrictions: true,
    newUserRestrictionDays: 7,
    requireApproval: false,
    reportThreshold: 3,
    autoRemoveThreshold: 5,
    allowAppeal: true,
    appealWaitingPeriod: 14,
    moderatorNotifications: true,
    keywordFiltering: true,
    filteredKeywords: "spam, scam, offensive, inappropriate",
    linkFiltering: true,
    imageModeration: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newMemberNotifications: true,
    reportNotifications: true,
    contentFlaggedNotifications: true,
    appealNotifications: true,
    digestFrequency: "daily",
    emailNotifications: true,
    pushNotifications: false,
    quietHours: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  })

  const [privacySettings, setPrivacySettings] = useState({
    memberDiscoverability: "all",
    contentIndexing: true,
    dataRetentionPeriod: "1year",
    allowDataExport: true,
    showOnlineStatus: true,
    showLastActive: true,
    allowDirectMessages: "members",
    requireVerification: false,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    enableAnalytics: true,
    enableSocialSharing: true,
    enableEmbed: false,
    enableApi: false,
    apiRateLimit: 100,
    webhookUrl: "",
    enableSso: false,
    ssoProvider: "none",
  })

  const handleSaveSettings = (section: string) => {
    // In a real application, this would save to a database
    toast({
      title: "Settings Saved",
      description: `Your ${section} settings have been saved successfully.`,
      variant: "default",
    })
  }

  return (

      <div className="flex min-h-screen bg-background">

        <div className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <h1 className="text-lg font-semibold">Community Settings</h1>
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Logged in as <span className="font-medium text-foreground">Sarah Chen</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid grid-cols-5 w-full md:w-auto">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="moderation" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Moderation</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Information</CardTitle>
                    <CardDescription>Basic information about your community that members will see.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="community-name">Community Name</Label>
                        <Input
                          id="community-name"
                          value={communitySettings.name}
                          onChange={(e) => setCommunitySettings({ ...communitySettings, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="community-handle">Community Handle</Label>
                        <Input
                          id="community-handle"
                          value={communitySettings.handle}
                          onChange={(e) => setCommunitySettings({ ...communitySettings, handle: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          This will be used in your community URL: commune.io/{communitySettings.handle}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="community-description">Community Description</Label>
                      <Textarea
                        id="community-description"
                        rows={4}
                        value={communitySettings.description}
                        onChange={(e) => setCommunitySettings({ ...communitySettings, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="community-language">Primary Language</Label>
                        <Select
                          value={communitySettings.language}
                          onValueChange={(value) => setCommunitySettings({ ...communitySettings, language: value })}
                        >
                          <SelectTrigger id="community-language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="community-timezone">Timezone</Label>
                        <Select
                          value={communitySettings.timezone}
                          onValueChange={(value) => setCommunitySettings({ ...communitySettings, timezone: value })}
                        >
                          <SelectTrigger id="community-timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                            <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => handleSaveSettings("general")}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Visibility & Access</CardTitle>
                    <CardDescription>Control who can see and join your community.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Community Visibility</Label>
                      <RadioGroup
                        value={communitySettings.visibility}
                        onValueChange={(value) => setCommunitySettings({ ...communitySettings, visibility: value })}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="visibility-public" />
                          <Label htmlFor="visibility-public" className="font-normal cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-primary" />
                              <div>
                                <p>Public</p>
                                <p className="text-sm text-muted-foreground">Anyone can find and view your community</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="restricted" id="visibility-restricted" />
                          <Label htmlFor="visibility-restricted" className="font-normal cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <div>
                                <p>Restricted</p>
                                <p className="text-sm text-muted-foreground">
                                  Anyone can find, but only members can view content
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="visibility-private" />
                          <Label htmlFor="visibility-private" className="font-normal cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-primary" />
                              <div>
                                <p>Private</p>
                                <p className="text-sm text-muted-foreground">
                                  Only members can find and view your community
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>Joining Requirements</Label>
                      <RadioGroup
                        value={communitySettings.joinType}
                        onValueChange={(value) => setCommunitySettings({ ...communitySettings, joinType: value })}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="open" id="join-open" />
                          <Label htmlFor="join-open" className="font-normal cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <div>
                                <p>Open</p>
                                <p className="text-sm text-muted-foreground">Anyone can join instantly</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="request" id="join-request" />
                          <Label htmlFor="join-request" className="font-normal cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              <div>
                                <p>Request to Join</p>
                                <p className="text-sm text-muted-foreground">
                                  Users must request and be approved by moderators
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="invite" id="join-invite" />
                          <Label htmlFor="join-invite" className="font-normal cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-purple-500" />
                              <div>
                                <p>Invite Only</p>
                                <p className="text-sm text-muted-foreground">Only users with invites can join</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => handleSaveSettings("visibility")}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Moderation Settings */}
              <TabsContent value="moderation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Automated Moderation</CardTitle>
                    <CardDescription>Configure how automated moderation tools work in your community.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-moderation">Enable Auto-Moderation</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically detect and handle potentially problematic content
                        </p>
                      </div>
                      <Switch
                        id="auto-moderation"
                        checked={moderationSettings.autoModeration}
                        onCheckedChange={(checked) =>
                          setModerationSettings({ ...moderationSettings, autoModeration: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>Content Filtering Strength</Label>
                      <div className="space-y-4">
                        <RadioGroup
                          value={moderationSettings.contentFiltering}
                          onValueChange={(value) =>
                            setModerationSettings({ ...moderationSettings, contentFiltering: value })
                          }
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="filter-low" />
                            <Label htmlFor="filter-low" className="font-normal cursor-pointer">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p>Low</p>
                                  <p className="text-sm text-muted-foreground">Only filter the most severe content</p>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="filter-medium" />
                            <Label htmlFor="filter-medium" className="font-normal cursor-pointer">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p>Medium (Recommended)</p>
                                  <p className="text-sm text-muted-foreground">
                                    Balance between filtering problematic content and allowing expression
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="filter-high" />
                            <Label htmlFor="filter-high" className="font-normal cursor-pointer">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p>High</p>
                                  <p className="text-sm text-muted-foreground">
                                    Strictly filter all potentially problematic content
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="keyword-filtering">Keyword Filtering</Label>
                          <p className="text-sm text-muted-foreground">Filter content containing specific keywords</p>
                        </div>
                        <Switch
                          id="keyword-filtering"
                          checked={moderationSettings.keywordFiltering}
                          onCheckedChange={(checked) =>
                            setModerationSettings({ ...moderationSettings, keywordFiltering: checked })
                          }
                        />
                      </div>
                      {moderationSettings.keywordFiltering && (
                        <div className="space-y-2">
                          <Label htmlFor="filtered-keywords">Filtered Keywords</Label>
                          <Textarea
                            id="filtered-keywords"
                            placeholder="Enter comma-separated keywords to filter"
                            value={moderationSettings.filteredKeywords}
                            onChange={(e) =>
                              setModerationSettings({ ...moderationSettings, filteredKeywords: e.target.value })
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Separate keywords with commas. Content containing these words will be flagged for review.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="link-filtering">Link Filtering</Label>
                          <p className="text-sm text-muted-foreground">Review posts containing external links</p>
                        </div>
                        <Switch
                          id="link-filtering"
                          checked={moderationSettings.linkFiltering}
                          onCheckedChange={(checked) =>
                            setModerationSettings({ ...moderationSettings, linkFiltering: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="image-moderation">Image Moderation</Label>
                          <p className="text-sm text-muted-foreground">
                            Scan uploaded images for inappropriate content
                          </p>
                        </div>
                        <Switch
                          id="image-moderation"
                          checked={moderationSettings.imageModeration}
                          onCheckedChange={(checked) =>
                            setModerationSettings({ ...moderationSettings, imageModeration: checked })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={() => handleSaveSettings("moderation")}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>New User Restrictions</CardTitle>
                    <CardDescription>
                      Set restrictions for new community members to prevent spam and abuse.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-user-restrictions">Enable New User Restrictions</Label>
                        <p className="text-sm text-muted-foreground">
                          Apply special rules to new members for a specified period
                        </p>
                      </div>
                      <Switch
                        id="new-user-restrictions"
                        checked={moderationSettings.newUserRestrictions}
                        onCheckedChange={(checked) =>
                          setModerationSettings({ ...moderationSettings, newUserRestrictions: checked })
                        }
                      />
                    </div>

                    {moderationSettings.newUserRestrictions && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="restriction-days">Restriction Period (Days)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider
                              id="restriction-days"
                              min={1}
                              max={30}
                              step={1}
                              value={[moderationSettings.newUserRestrictionDays]}
                              onValueChange={(value) =>
                                setModerationSettings({ ...moderationSettings, newUserRestrictionDays: value[0] })
                              }
                              className="flex-1"
                            />
                            <span className="w-12 text-center">{moderationSettings.newUserRestrictionDays}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label>New User Restrictions</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="restrict-links" defaultChecked />
                              <Label htmlFor="restrict-links" className="font-normal cursor-pointer">
                                Cannot post external links
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="restrict-images" defaultChecked />
                              <Label htmlFor="restrict-images" className="font-normal cursor-pointer">
                                Limited image uploads (3 per day)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="restrict-dm" defaultChecked />
                              <Label htmlFor="restrict-dm" className="font-normal cursor-pointer">
                                Cannot send direct messages to other members
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="restrict-post-frequency" defaultChecked />
                              <Label htmlFor="restrict-post-frequency" className="font-normal cursor-pointer">
                                Limited post frequency (5 per day)
                              </Label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="require-approval">Require Post Approval</Label>
                        <p className="text-sm text-muted-foreground">
                          New user posts require moderator approval before becoming visible
                        </p>
                      </div>
                      <Switch
                        id="require-approval"
                        checked={moderationSettings.requireApproval}
                        onCheckedChange={(checked) =>
                          setModerationSettings({ ...moderationSettings, requireApproval: checked })
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={() => handleSaveSettings("new-user")}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Report Handling</CardTitle>
                    <CardDescription>Configure how member reports are processed and handled.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="report-threshold">Report Threshold for Notification</Label>
                        <div className="flex items-center space-x-4">
                          <Slider
                            id="report-threshold"
                            min={1}
                            max={10}
                            step={1}
                            value={[moderationSettings.reportThreshold]}
                            onValueChange={(value) =>
                              setModerationSettings({ ...moderationSettings, reportThreshold: value[0] })
                            }
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{moderationSettings.reportThreshold}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Number of reports needed before moderators are notified
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auto-remove-threshold">Auto-Remove Threshold</Label>
                        <div className="flex items-center space-x-4">
                          <Slider
                            id="auto-remove-threshold"
                            min={0}
                            max={20}
                            step={1}
                            value={[moderationSettings.autoRemoveThreshold]}
                            onValueChange={(value) =>
                              setModerationSettings({ ...moderationSettings, autoRemoveThreshold: value[0] })
                            }
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{moderationSettings.autoRemoveThreshold}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Number of reports needed to automatically hide content (0 to disable)
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allow-appeal">Allow Content Removal Appeals</Label>
                          <p className="text-sm text-muted-foreground">
                            Let members appeal when their content is removed
                          </p>
                        </div>
                        <Switch
                          id="allow-appeal"
                          checked={moderationSettings.allowAppeal}
                          onCheckedChange={(checked) =>
                            setModerationSettings({ ...moderationSettings, allowAppeal: checked })
                          }
                        />
                      </div>

                      {moderationSettings.allowAppeal && (
                        <div className="space-y-2">
                          <Label htmlFor="appeal-waiting-period">Appeal Waiting Period (Days)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider
                              id="appeal-waiting-period"
                              min={1}
                              max={30}
                              step={1}
                              value={[moderationSettings.appealWaitingPeriod]}
                              onValueChange={(value) =>
                                setModerationSettings({ ...moderationSettings, appealWaitingPeriod: value[0] })
                              }
                              className="flex-1"
                            />
                            <span className="w-12 text-center">{moderationSettings.appealWaitingPeriod}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Days a member must wait before submitting another appeal
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="moderator-notifications">Moderator Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to moderators for important events
                        </p>
                      </div>
                      <Switch
                        id="moderator-notifications"
                        checked={moderationSettings.moderatorNotifications}
                        onCheckedChange={(checked) =>
                          setModerationSettings({ ...moderationSettings, moderatorNotifications: checked })
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={() => handleSaveSettings("reports")}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Moderator Notifications</CardTitle>
                    <CardDescription>Configure when and how moderators receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Notification Events</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="new-member-notifications" className="cursor-pointer">
                            New member joins
                          </Label>
                          <Switch
                            id="new-member-notifications"
                            checked={notificationSettings.newMemberNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, newMemberNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="report-notifications" className="cursor-pointer">
                            Content is reported
                          </Label>
                          <Switch
                            id="report-notifications"
                            checked={notificationSettings.reportNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, reportNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="content-flagged-notifications" className="cursor-pointer">
                            Content is auto-flagged
                          </Label>
                          <Switch
                            id="content-flagged-notifications"
                            checked={notificationSettings.contentFlaggedNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, contentFlaggedNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="appeal-notifications" className="cursor-pointer">
                            Member submits an appeal
                          </Label>
                          <Switch
                            id="appeal-notifications"
                            checked={notificationSettings.appealNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, appealNotifications: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>Notification Methods</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications" className="cursor-pointer">
                            Email Notifications
                          </Label>
                          <Switch
                            id="email-notifications"
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-notifications" className="cursor-pointer">
                            Push Notifications
                          </Label>
                          <Switch
                            id="push-notifications"
                            checked={notificationSettings.pushNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="digest-frequency">Notification Digest Frequency</Label>
                      <Select
                        value={notificationSettings.digestFrequency}
                        onValueChange={(value) =>
                          setNotificationSettings({ ...notificationSettings, digestFrequency: value })
                        }
                      >
                        <SelectTrigger id="digest-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        How often to send notification digests to moderators
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                        <p className="text-sm text-muted-foreground">Pause notifications during specified hours</p>
                      </div>
                      <Switch
                        id="quiet-hours"
                        checked={notificationSettings.quietHours}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, quietHours: checked })
                        }
                      />
                    </div>

                    {notificationSettings.quietHours && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quiet-hours-start">Start Time</Label>
                          <Input
                            id="quiet-hours-start"
                            type="time"
                            value={notificationSettings.quietHoursStart}
                            onChange={(e) =>
                              setNotificationSettings({ ...notificationSettings, quietHoursStart: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quiet-hours-end">End Time</Label>
                          <Input
                            id="quiet-hours-end"
                            type="time"
                            value={notificationSettings.quietHoursEnd}
                            onChange={(e) =>
                              setNotificationSettings({ ...notificationSettings, quietHoursEnd: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={() => handleSaveSettings("notifications")}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Privacy Settings */}
              <TabsContent value="privacy" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>Control privacy settings and data handling for your community.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Member Discoverability</Label>
                      <RadioGroup
                        value={privacySettings.memberDiscoverability}
                        onValueChange={(value) =>
                          setPrivacySettings({ ...privacySettings, memberDiscoverability: value })
                        }
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="discover-all" />
                          <Label htmlFor="discover-all" className="font-normal cursor-pointer">
                            <div>
                              <p>Public</p>
                              <p className="text-sm text-muted-foreground">Anyone can see the member list</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="members" id="discover-members" />
                          <Label htmlFor="discover-members" className="font-normal cursor-pointer">
                            <div>
                              <p>Members Only</p>
                              <p className="text-sm text-muted-foreground">
                                Only community members can see the member list
                              </p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="discover-none" />
                          <Label htmlFor="discover-none" className="font-normal cursor-pointer">
                            <div>
                              <p>Hidden</p>
                              <p className="text-sm text-muted-foreground">Member list is hidden from everyone</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="content-indexing">Allow Search Engine Indexing</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow search engines to index your community content
                        </p>
                      </div>
                      <Switch
                        id="content-indexing"
                        checked={privacySettings.contentIndexing}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({ ...privacySettings, contentIndexing: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data-retention">Data Retention Period</Label>
                      <Select
                        value={privacySettings.dataRetentionPeriod}
                        onValueChange={(value) =>
                          setPrivacySettings({ ...privacySettings, dataRetentionPeriod: value })
                        }
                      >
                        <SelectTrigger id="data-retention">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">30 Days</SelectItem>
                          <SelectItem value="90days">90 Days</SelectItem>
                          <SelectItem value="6months">6 Months</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="forever">Indefinitely</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">How long to retain deleted content and user data</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow-data-export">Allow Member Data Export</Label>
                        <p className="text-sm text-muted-foreground">Let members export their contribution data</p>
                      </div>
                      <Switch
                        id="allow-data-export"
                        checked={privacySettings.allowDataExport}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({ ...privacySettings, allowDataExport: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>Member Privacy Options</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-online-status" className="cursor-pointer">
                            Show online status
                          </Label>
                          <Switch
                            id="show-online-status"
                            checked={privacySettings.showOnlineStatus}
                            onCheckedChange={(checked) =>
                              setPrivacySettings({ ...privacySettings, showOnlineStatus: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-last-active" className="cursor-pointer">
                            Show last active time
                          </Label>
                          <Switch
                            id="show-last-active"
                            checked={privacySettings.showLastActive}
                            onCheckedChange={(checked) =>
                              setPrivacySettings({ ...privacySettings, showLastActive: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="require-verification" className="cursor-pointer">
                            Require email verification
                          </Label>
                          <Switch
                            id="require-verification"
                            checked={privacySettings.requireVerification}
                            onCheckedChange={(checked) =>
                              setPrivacySettings({ ...privacySettings, requireVerification: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allow-direct-messages">Direct Message Permissions</Label>
                      <Select
                        value={privacySettings.allowDirectMessages}
                        onValueChange={(value) =>
                          setPrivacySettings({ ...privacySettings, allowDirectMessages: value })
                        }
                      >
                        <SelectTrigger id="allow-direct-messages">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Anyone can message members</SelectItem>
                          <SelectItem value="members">Only members can message each other</SelectItem>
                          <SelectItem value="following">Only people you follow can message you</SelectItem>
                          <SelectItem value="none">Disable direct messages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={() => handleSaveSettings("privacy")}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Integrations Settings */}
              <TabsContent value="integrations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>External Integrations</CardTitle>
                    <CardDescription>Connect your community with external services and platforms.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-analytics">Analytics Integration</Label>
                        <p className="text-sm text-muted-foreground">Track community metrics and engagement</p>
                      </div>
                      <Switch
                        id="enable-analytics"
                        checked={integrationSettings.enableAnalytics}
                        onCheckedChange={(checked) =>
                          setIntegrationSettings({ ...integrationSettings, enableAnalytics: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-social-sharing">Social Media Sharing</Label>
                        <p className="text-sm text-muted-foreground">Allow content to be shared on social platforms</p>
                      </div>
                      <Switch
                        id="enable-social-sharing"
                        checked={integrationSettings.enableSocialSharing}
                        onCheckedChange={(checked) =>
                          setIntegrationSettings({ ...integrationSettings, enableSocialSharing: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-embed">Content Embedding</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow community content to be embedded on external sites
                        </p>
                      </div>
                      <Switch
                        id="enable-embed"
                        checked={integrationSettings.enableEmbed}
                        onCheckedChange={(checked) =>
                          setIntegrationSettings({ ...integrationSettings, enableEmbed: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enable-api">API Access</Label>
                          <p className="text-sm text-muted-foreground">Enable API access to your community data</p>
                        </div>
                        <Switch
                          id="enable-api"
                          checked={integrationSettings.enableApi}
                          onCheckedChange={(checked) =>
                            setIntegrationSettings({ ...integrationSettings, enableApi: checked })
                          }
                        />
                      </div>

                      {integrationSettings.enableApi && (
                        <div className="space-y-2">
                          <Label htmlFor="api-rate-limit">API Rate Limit (requests per hour)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider
                              id="api-rate-limit"
                              min={10}
                              max={1000}
                              step={10}
                              value={[integrationSettings.apiRateLimit]}
                              onValueChange={(value) =>
                                setIntegrationSettings({ ...integrationSettings, apiRateLimit: value[0] })
                              }
                              className="flex-1"
                            />
                            <span className="w-16 text-center">{integrationSettings.apiRateLimit}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://your-service.com/webhook"
                        value={integrationSettings.webhookUrl}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, webhookUrl: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Receive real-time notifications about community events
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enable-sso">Single Sign-On (SSO)</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow members to sign in with external identity providers
                          </p>
                        </div>
                        <Switch
                          id="enable-sso"
                          checked={integrationSettings.enableSso}
                          onCheckedChange={(checked) =>
                            setIntegrationSettings({ ...integrationSettings, enableSso: checked })
                          }
                        />
                      </div>

                      {integrationSettings.enableSso && (
                        <div className="space-y-2">
                          <Label htmlFor="sso-provider">SSO Provider</Label>
                          <Select
                            value={integrationSettings.ssoProvider}
                            onValueChange={(value) =>
                              setIntegrationSettings({ ...integrationSettings, ssoProvider: value })
                            }
                          >
                            <SelectTrigger id="sso-provider">
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="google">Google</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="github">GitHub</SelectItem>
                              <SelectItem value="custom">Custom OIDC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={() => handleSaveSettings("integrations")}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

  )
}

