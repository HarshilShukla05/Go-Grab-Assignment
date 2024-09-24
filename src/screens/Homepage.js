import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TextInput, TouchableOpacity, FlatList, Alert } from "react-native"
import { Picker } from '@react-native-picker/picker';
import { Card } from '../components';
import { COLORS, SIZES, FONTS, SHADOW } from '../constants';

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight + 10,
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: SIZES.padding
    },
    textBoxWrapper: {
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: SIZES.padding
    },
    textInput: {
        ...SHADOW,
        borderRadius: SIZES.textBoxRadius,
        backgroundColor: COLORS.secondary,
        height: 42,
        paddingLeft: 15,
        width: "90%",
        color: COLORS.primary,
        marginRight: 15,
        ...FONTS.h2_semiBold,
    },
    btn: {
        ...SHADOW,
        backgroundColor: COLORS.accent,
        height: 50,
        width: 50,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    groupInput: {
        ...SHADOW,
        borderRadius: SIZES.textBoxRadius,
        backgroundColor: COLORS.secondary,
        height: 42,
        paddingLeft: 15,
        marginBottom: 15,
        ...FONTS.h2_semiBold,
        color: COLORS.primary,
    },
    groupPicker: {
        height: 50,
        width: "100%",
        color: COLORS.secondary,
        marginBottom: 20,
        ...FONTS.h2_semiBold
    },
    addGroupButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: SIZES.buttonRadius,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        ...SHADOW,
    },
    deleteGroupButton: {
        backgroundColor: COLORS.danger, // Assuming you have a danger color for delete buttons
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: SIZES.buttonRadius,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        ...SHADOW,
    },
    buttonText: {
        color: COLORS.secondary,
        fontSize: 16,
        ...FONTS.h2_semiBold,
    },
    groupText: {
        color: COLORS.secondary,
        fontSize: 18,
        ...FONTS.h2_semiBold,
        textAlign: "center",
        marginVertical: 10,
    },
})

export default function Homepage() {

    //State variables
    const [list, setList] = useState([]);
    const [value, setValue] = useState("");
    const [groups, setGroups] = useState(["General"]); // Initial group
    const [selectedGroup, setSelectedGroup] = useState("General");
    const [newGroup, setNewGroup] = useState("");

    // Function to add a new group
    function addGroup(groupName) {
        if (groupName && !groups.includes(groupName)) {
            setGroups(prev => [...prev, groupName]);
            setNewGroup("");
        } else {
            alert("Group already exists or invalid name!");
        }
    }

    // Function to delete a group
    function deleteGroup(groupName) {
        if (groupName === "General") {
            alert("Cannot delete the default 'General' group!");
            return;
        }

        Alert.alert(
            "Delete Group",
            `Are you sure you want to delete the group '${groupName}'? All tasks in this group will be deleted.`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: () => {
                        // Remove the group
                        setGroups(prev => prev.filter(group => group !== groupName));

                        // Remove tasks in the deleted group
                        setList(prevList => prevList.filter(task => task.group !== groupName));

                        // Reset selected group if the deleted one was selected
                        if (selectedGroup === groupName) {
                            setSelectedGroup("General");
                        }
                    }
                }
            ]
        );
    }

    // A function that adds a task to the selected group
    function addText(text) {
        if (value !== "") {
            setList(prev => {
                return [
                    ...prev,
                    { text: text, isSelected: false, group: selectedGroup } // Adding group to task
                ]
            })
            setValue("")
        } else {
            alert("Please type in something!")
        }
    }

    // A function to set the value of isSelected based on the state of the checkbox
    function setIsSelected(index, value) {
        let data = []


        for (let i = 0; i < list.length; i++) {
            if (index === i) {
                data.push({ ...list[i], isSelected: value }) // Updating the object at position i === index
            } else {
                data.push(list[i])
            }
        }

        setList(data) // Setting the new state
    }

    // A function to delete an item at position idx from the list array
    function deleteItem(idx) {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: () => {
                        const data = list.filter((item, index) => index !== idx)
                        setList(data)
                    }
                }
            ])
    }

    return <View style={styles.container}>
        <Text style={{ ...FONTS.h1_semiBold, color: COLORS.secondary, marginBottom: 15 }}>What needs to be done.</Text>

        <TextInput
            style={styles.groupInput}
            placeholder="Create a New Group"
            placeholderTextColor={COLORS.primary}
            value={newGroup}
            onChangeText={text => setNewGroup(text)}
        />
        <TouchableOpacity style={styles.addGroupButton} onPress={() => addGroup(newGroup)}>
            <Text style={styles.buttonText}>Add Group</Text>
        </TouchableOpacity>


        <Text style={styles.groupText}>Selected Group: {selectedGroup}</Text>


        <Picker
            selectedValue={selectedGroup}
            style={styles.groupPicker}
            onValueChange={(itemValue, itemIndex) => setSelectedGroup(itemValue)}
        >
            {groups.map((group, index) => (
                <Picker.Item key={index} label={group} value={group} />
            ))}
        </Picker>

        {/* Delete Group Button */}
        {selectedGroup !== "General" && (
            <TouchableOpacity style={styles.deleteGroupButton} onPress={() => deleteGroup(selectedGroup)}>
                <Text style={styles.buttonText}>Delete Group</Text>
            </TouchableOpacity>
        )}

        {/* Task List */}
        <FlatList
            style={{ flex: 1 }}
            data={list.filter(item => item.group === selectedGroup)} // Only show tasks for selected group
            renderItem={({ item, index }) => (
                <Card
                    data={item}
                    index={index}
                    setIsSelected={setIsSelected}
                    deleteItem={deleteItem}
                />
            )}
            keyExtractor={(item, index) => index.toString()}
        />

        <View style={styles.textBoxWrapper}>
            <TextInput
                style={styles.textInput}
                placeholder="New Task"
                placeholderTextColor={COLORS.primary}
                onChangeText={text => setValue(text)}
                value={value}
            />
            <TouchableOpacity style={styles.btn} onPress={() => addText(value)}>
                <Text style={{ fontSize: 34, color: COLORS.secondary }}>+</Text>
            </TouchableOpacity>
        </View>
    </View>
}
