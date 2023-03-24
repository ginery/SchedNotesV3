import React from 'react';
import {Alert} from 'react-native';
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
import {ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = open({name: 'myDB'});
class Controller extends React.PureComponent {
  state = {
    user_id: 0,
    // customer_data: [],
  };
  componentWillUnmount() {
    this.setState({});
  }
  static instance = Controller.instance || new Controller();

  createTableCustomer() {
    db.execute(
      'CREATE TABLE IF NOT EXISTS "tbl_customer" (customer_id INTEGER PRIMARY KEY AUTOINCREMENT, company_id TEXT NOT NULL, branch_id TEXT NOT NULL, branch TEXT NOT NULL, farm_name DATETIME, customer DATETIME, farm_type TEXT NOT NULL, population TEXT NOT NULL,contact_no TEXT NOT NULL, location TEXT NOT NULL, date_added DATETIME, encoded_by TEXT NOT NULL, update_status TEXT NOT NULL, sync_status INTEGER);',
    );
  }
  createTableBranch() {
    db.execute(
      'CREATE TABLE IF NOT EXISTS "tbl_branch" (branch_id INTEGER, island_group TEXT NOT NULL, region TEXT NOT NULL, province DATETIME, company_id INTEGER, branch TEXT NOT NULL, remarks TEXT NOT NULL, status TEXT NOT NULL, coordinates TEXT NOT NULL);',
    );
  }
  dropTable() {
    db.execute(`DROP TABLE IF EXISTS tbl_customer`);
    db.execute(`DROP TABLE IF EXISTS tbl_branch`);
  }
  insertDataBranch(
    branch_id,
    branch,
    island_group,
    region,
    province,
    company_id,
    remarks,
    status,
    coordinates,
  ) {
    db.execute(
      'INSERT INTO "tbl_branch" (branch_id ,island_group, region, province, company_id, branch, remarks, status, coordinates) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [
        branch_id,
        island_group,
        region,
        province,
        company_id,
        branch,
        remarks,
        status,
        coordinates,
      ],
    );
  }
  insertDataCustomer(
    company_id,
    branch_id,
    branch,
    farmname,
    customer,
    farm_type,
    population,
    contact_no,
    location,
    date_added,
    encoded_by,
    update_status,
    sync_status,
  ) {
    db.execute(
      'INSERT INTO "tbl_customer" (company_id, branch_id, branch, farm_name, customer, farm_type, population, contact_no, location, date_added, encoded_by, update_status, sync_status) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?);',
      [
        company_id,
        branch_id,
        branch,
        farmname,
        customer,
        farm_type,
        population,
        contact_no,
        location,
        date_added,
        // getDate(new Date()),
        encoded_by,
        update_status,
        sync_status,
      ],
    );
  }
  selectTableCustomer() {
    // const data = [];
    const dd = db
      .executeAsync('SELECT * FROM "tbl_customer";', [])
      .then(({rows}) => {
        // var data = rows;
        // data = [{id: 1, g: 2}];
        var data_arr = rows._array.map(function (item, index) {
          // console.log(item);
          return {
            branch_id: item.branch_id,
            branch: item.branch,
            company_id: item.company_id,
            contact_no: item.contact_no,
            customer: item.customer,
            customer_id: item.customer_id,
            date_added: item.date_added,
            encoded_by: item.encoded_by,
            farm_name: item.farm_name,
            farm_type: item.farm_type,
            location: item.location,
            population: item.population,
            sync_status: item.sync_status,
            update_status: item.update_status,
            query_data: item.customer,
          };
        });
        return data_arr;
        // console.log(data);
      });

    // data.push({id: 2, g: 3});
    return dd;
  }
  async getUserFromCached() {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        var value = JSON.parse(valueString);
        this.setState(value.user_id);
        console.log(this.state.user_id, 'state');
      }
    } catch (error) {
      // console.log(error);
    }
    return this.state.user_id;
  }
  getCustomer(user_id) {
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'customers', {
      method: 'POST',
      headers: {
        Accept: 'applicatiion/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.array_data != '') {
          // console.log(responseJson);
          responseJson.array_data.map((item, index) => {
            this.insertDataCustomer(
              item.company_id,
              item.branch_id,
              item.branch,
              item.farm_name,
              item.customer,
              item.farm_type,
              item.population,
              item.contact_no,
              item.location,
              item.date_added,
              item.encoded_by,
              item.update_status,
              item.sync_status,
            );
          });
          ToastAndroid.showWithGravity(
            'Success.',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        } else {
        }
      })
      .catch(error => {
        console.log(error, 'error: getCustomer');
      });
  }
  updateData() {
    db.executeAsync(
      'SELECT * FROM "tbl_customer" WHERE sync_status="0";',
      [],
    ).then(({rows}) => {
      // console.log('customer', rows);
      var data = rows._array;
      if (data == '') {
        console.log('wala sa data');
        this.dropTable();
        this.createTableCustomer();
        this.createTableBranch();
        // this.getBranch();
        this.getCustomer();
      } else {
        console.log('may data unod');
        var data_array = data.map((item, index) => {
          return {
            company_id: item.company_id,
            branch_id: item.branch_id,
            farm_name: item.farm_name,
            customer: item.customer,
            farm_type: item.farm_type,
            population: item.population,
            location: item.location,
            contact_no: item.contact_no,
            encoded_by: item.encoded_by,
            date_added: item.date_added,
            update_status: item.update_status,
            sync_status: item.sync_status,
          };
        });
        // console.log(data);
        const formData = new FormData();
        formData.append('array_data', JSON.stringify(data_array));
        fetch(window.name + 'customer/store', {
          method: 'POST',
          header: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        })
          .then(response => response.json())
          .then(responseJson => {
            // console.log(responseJson);
            //   data.map((item, index) => {
            //     console.log(item);
            //   });

            if (responseJson.array_data != '') {
              if (responseJson.array_data[0].response == 1) {
                this.dropTable();
                this.createTableCustomer();
                this.createTableBranch();
                // getBranch();
                this.getCustomer();
                // setUpdateBotton(false);
                ToastAndroid.showWithGravity(
                  'Great! Customer successfully updated.',
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                );
                // Alert.alert('Great! Customer successfully updated.');
              } else {
                // Alert.alert('Customer already updated!');
                this.dropTable();
                this.createTableCustomer();
                this.createTableBranch();
                // getBranch();
                this.getCustomer();
                // setUpdateBotton(false);
                ToastAndroid.showWithGravity(
                  'Customer already updated!',
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                );
                // Al
              }
            } else {
              // this.getBranch();
            }
          })
          .catch(error => {
            // setUpdateBotton(false);
            console.error(error, 'updateData');
            // Alert.alert('Internet Connection Error');
          });
      }
    });
  }
}
export default Controller;
